import express from 'express';
import auth from '../../middlewares/auth';
import { BoardController } from './board.controller';

const router = express.Router();

router.post('/', auth(), BoardController.insertIntoDB);
router.post('/:id/member', auth(), BoardController.addBoardMembers);
router.delete('/:id/member', auth(), BoardController.removeBoardMember);
router.get('/member', auth(), BoardController.getAllBoardsOfMember);

export const BoardRoutes = router;
