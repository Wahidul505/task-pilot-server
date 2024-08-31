import express from 'express';
import auth from '../../middlewares/auth';
import { CommentController } from './comment.controller';

const router = express.Router();

router.post('/', auth(), CommentController.addComment);

export const CommentRoutes = router;
