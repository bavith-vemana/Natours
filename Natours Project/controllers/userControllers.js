const AppError = require('../utils/appError');
const User = require('../models/userModel');
const handlerFactory = require('../controllers/handlerFactory');
const multer = require('multer');
const eslintConfigPrettier = require('eslint-config-prettier');
const sharp = require('sharp');
exports.uploadPhoto = () => {
  //noramal storage

  // const storage = multer.diskStorage({
  //   destination: (req, file, callback) => {
  //     callback(null, 'public/img/users');
  //   },
  //   filename: (req, file, callback) => {
  //     const ext = file.mimetype.split('/')[1];
  //     const fileName =
  //       'user' + '-' + req.userDetails._id + '-' + Date.now() + '.' + ext;
  //     //console.log(file);
  //     callback(null, fileName);
  //   },
  // });

  //buffer
  const storage = multer.memoryStorage();

  const filter = (req, file, callback) => {
    const types = ['png', 'jpg', 'jpeg'];
    const ext = file.mimetype.split('/')[1];
    if (types.includes(ext)) {
      callback(null, true);
    } else {
      callback(
        new AppError('Please upload only png,jpg & jpeg formats only!', 400),
      );
    }
  };

  const upload = multer({ storage: storage, fileFilter: filter }).single(
    'updatedPhoto',
  );

  return upload;
};

exports.resizeUserPhoto = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('no Image found', 500));

    const ext = req.file.mimetype.split('/')[1];
    const fileName = `user-${req.userDetails._id}.${ext}`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFile(`public/img/users/${fileName}`);

    req.file.filename = fileName; // standard property name

    next(); // move to next middleware
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    // console.log(req.file);
    if (!req.body) {
      next(new AppError('please provide data to update', 400));
    }
    const { updatedEmail, updatedName } = req.body;
    const user = await User.findById(req.userDetails._id);
    if (updatedEmail) {
      user.email = updatedEmail;
    }
    if (updatedName) {
      user.name = updatedName;
    }
    if (req.file.filename) {
      user.photo = req.file.filename;
    }
    const updatedDetails = await user.save();
    res.status(200).json({
      status: 'success',
      updatedDetails: updatedDetails,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
exports.getMe = async (req, res, next) => {
  try {
    const data = await handlerFactory.findById(User, req.userDetails._id);
    res.status(200).json({
      status: 'sucess',
      User: data,
    });
  } catch (err) {
    next(err);
  }
};
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'sucess',
      Users: users,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const savedData = await User.create(req.body);
    res.status(200).json({
      status: 'success',
      savedUser: savedData,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route not defined yet',
  });
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userDetails._id).select('+active');
    user.active = false;
    await user.save();
    res.status(200).json({
      status: 'sucess',
      message: 'Account deactivated',
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.updateUser = async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route not defined yet',
  });
};
