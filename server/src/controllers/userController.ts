import { RequestHandler } from 'express';
import UserModel from '../models/User';

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId)
      .select('+email')
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
