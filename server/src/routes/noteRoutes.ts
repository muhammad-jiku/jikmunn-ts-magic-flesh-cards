import express from 'express';
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from '../controllers/noteController';
import { requiresAuth } from '../middlewares/Auth';

export const noteRoute = express.Router({
  caseSensitive: true,
});

noteRoute.route('/').get(getNotes).post(createNote);
noteRoute.route('/:noteId').get(getNote).patch(updateNote).delete(deleteNote);
