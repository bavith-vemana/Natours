const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const Email = require('../utils/Email');
const crypto = require('crypto');
const handlerFactory = require('../controllers/handlerFactory');
const { url } = require('inspector');

const jsonToken = async (id) => {
  const payload = {
    id: id,
  };
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
const createAndSendToken = async (res, id, extraData) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN_HR * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: true,
  };
  const token = await jsonToken(id);
  res.cookie('jwt', token, cookieOptions);
  if (extraData) {
    return res.status(200).json({
      token: token,
      status: 'Sucess',
      ...extraData,
    });
  }
  return res.status(200).json({
    token: token,
    status: 'Sucess',
  });
};
exports.signUp = async (req, res, next) => {
  try {
    const newUser = await handlerFactory.createDocs(User, req.body);
    await createAndSendToken(res, newUser._id, { user: newUser });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //check if password and email exsit
    if (!email || !password) {
      return next(new AppError('please enter email and password', 400));
    }
    const userDetails = await User.findOne({ email: email }).select(
      '+password',
    );
    const isMatch = await userDetails.comparePassword(
      password,
      userDetails.password,
    );
    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }
    await createAndSendToken(res, userDetails._id);
  } catch (err) {
    next(new AppError(err, 500));
  }
};
exports.logout = (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: true,
  };
  res.cookie('jwt', 'loggedOut', cookieOptions);

  res.status(200).json({
    status: 'success',
    message: 'Loggged Out',
  });
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    // 1) Check if token exists
    if (!req.cookies.jwt) {
      res.locals.user = undefined;
      return next();
    }

    // 2) Verify token
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const user = await User.findById(decoded.id).select('+active');
    if (!user) {
      res.locals.user = undefined;
      return next();
    }

    // 4) Check if password changed after token issued
    // if (user.changedPasswordAfter(decoded.iat)) {
    //   console.log('user.changedPasswordAfter(decoded.iat)');
    //   res.locals.user = undefined;
    //   return next();
    // }

    // 5) Attach user to locals to access every where
    res.locals.user = user;
    next();
  } catch (err) {
    res.locals.user = undefined;
    return next();
  }
};

exports.protect = async (req, res, next) => {
  //1) check if there is token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('Please Login to access data', 401));
  }

  //2) verify Token
  const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError(err.name, 401));
    }
    return decoded;
  });

  //after issuing a token and if user deleted
  const userDetails = await User.findById(decoded.id).select('+active');
  if (!userDetails.active) {
    return next(new AppError('User deactivated', 401));
  }
  if (!userDetails) {
    return next(new AppError('Token no longer exists', 401));
  }

  //password changed after token issued

  if (!userDetails.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Please login again with new password', 401));
  }
  //adding userdetails to request
  req.userDetails = userDetails;

  next();
};

exports.restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles || roles.length === 0) {
      return next();
    }
    if (roles.includes(req.userDetails.role)) {
      return next(new AppError('Unauthorized access', 403));
    }
    return next();
  };
};

exports.accessTo = (roles) => {
  return (req, res, next) => {
    if (!roles || roles.length === 0) {
      return next();
    }
    if (roles.includes(req.userDetails.role)) {
      return next();
    }
    console.log(roles);
    return next(new AppError(req.userDetails.role, 403));
  };
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // checking if user exists
    const user = await User.findOne({ email: req.body.email }).select(
      '+active',
    );
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    if (!user.active) {
      return next(new AppError('User deactivated', 401));
    }
    const Url = `${req.protocol}://${req.get('host')}`;
    const sendMail = new Email(user, Url);
    await sendMail.sendPasswordResetMail();
    res.status(200).json({
      status: 'success',
      message: 'Token Sent to email',
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.resetPassword = async (req, res, next) => {
  //get users based on token
  //check for token expired time
  //set the new password and update in data base
  //send new JWT token for the user
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
    });
    //get users based on token
    if (!user) {
      next(new AppError('Invalid link please check the link', 400));
    }
    //check for token expired time
    if (Date.now() > user.passwordResetExpires) {
      next(new AppError('Link Expired', 410));
    }

    //set the new password and update in data base
    user.password = req.body.password;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    const newUser = await user.save({ validateBeforeSave: false });
    //send new JWT token for the user
    const token = await jsonToken(user._id);
    res.status(200).json({
      status: 'success',
      token: token,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.updatePassword = async (req, res, next) => {
  //check if user entered password
  //get user details
  //check if old password matches then update
  //send new JWT Token
  try {
    console.log('in Update');
    //check user enters old password
    if (!req.body.oldPassword) {
      next(new AppError('Please enter Old password', 400));
    }
    const user = await User.findById(req.userDetails._id).select('+password');
    //check if user exists
    if (!user) {
      next(new AppError('please login again', 400));
    }
    //check if oldpassword matches to data base
    const isMatch = await user.comparePassword(
      req.body.oldPassword,
      user.password,
    );
    if (!isMatch) {
      next(new AppError('Invalid password! please try again', 400));
    }

    //check user enters new password
    if (!req.body.newPassword) {
      next(new AppError('Please enter New password', 400));
    }

    //set the new password and update in data base
    user.password = req.body.newPassword;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    const newUser = await user.save({ validateBeforeSave: false });
    //send new JWT token for the user
    await createAndSendToken(res, user._id, {
      message: 'password updated sucessfully please login with new password ',
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// exports.isLoggedIn = async (req, res, next) => {
//   //1) check if there is token
//   let token;
//   if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   } else {
//     return next();
//   }
//   //2) verify Token
//   const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return next();
//     }
//     return decoded;
//   });

//   if (!decoded) {
//     return next();
//   }

//   const userDetails = await User.findById(decoded.id).select('+active');
//   if (!userDetails) {
//     return next();
//   }

//   //password changed after token issued

//   if (!userDetails.changedPasswordAfter(decoded.iat)) {
//     return next();
//   }
//   res.locals.user = userDetails;
//   next();
// };
