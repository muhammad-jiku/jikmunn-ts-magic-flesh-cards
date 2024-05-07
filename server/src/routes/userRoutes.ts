import express from 'express';
import { requiresAuth } from '../middlewares/Auth';
import {
  getAuthenticatedUser,
  signUp,
  signIn,
  signOut,
} from '../controllers/userController';

export const userRoute = express.Router({
  caseSensitive: true,
});

userRoute.route('/').get(requiresAuth, getAuthenticatedUser);
userRoute.route('/signup').post(signUp);
userRoute.route('/signin').post(signIn);
userRoute.route('/signout').post(signOut);
