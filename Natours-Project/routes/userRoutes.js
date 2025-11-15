const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userControllers');

const authController = require('../controllers/authController');


const upload = userController.uploadPhoto();
userRouter.route('/signup').post(authController.signUp);
userRouter.route('/login').post(authController.login);
userRouter.route('/forgetpassword').post(authController.forgotPassword);
userRouter.route('/resetpassword/:token').patch(authController.resetPassword);

userRouter.route('/').post(userController.createUser);

userRouter.use(authController.protect);
userRouter.route('/updatepassword').patch(authController.updatePassword);

userRouter.route('/logout').get(authController.logout);

userRouter
  .route('/updateMe')
  .patch(upload, userController.resizeUserPhoto, userController.updateMe);

userRouter.route('/me').get(userController.getMe);
userRouter.route('/deactivateAccount').delete(userController.deactivateUser);

userRouter
  .route('/')
  .get(authController.accessTo(['admin']), userController.getAllUsers);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser);

module.exports = { userRouter };
