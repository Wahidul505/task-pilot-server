import express from 'express';
import auth from '../../middlewares/auth';
import { BoardController } from './board.controller';

const router = express.Router();

router.post('/', auth(), BoardController.insertIntoDB);
router.post('/:id/member', auth(), BoardController.addBoardMembers);

export const BoardRoutes = router;
