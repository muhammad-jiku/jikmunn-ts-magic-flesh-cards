import { RequestHandler } from 'express';
import { isAssertDefined } from '../utils/isAssertDefined';
import note from '../models/Note';

export const getNotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    isAssertDefined(authenticatedUserId);

    const notes = await note.find({ userId: authenticatedUserId }).exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};
