import express from 'express';
import auth from '../../middlewares/auth';
import { BoardController } from './board.controller';

const router = express.Router();

router.patch('/admin/:id/privacy', auth(), BoardController.changeBoardPrivacy);
router.get('/member', auth(), BoardController.getAllBoardsOfMember);
router.post('/:id/member', auth(), BoardController.addBoardMembers);
router.delete('/:id/member', auth(), BoardController.removeBoardMember);
router.post('/', auth(), BoardController.insertIntoDB);

export const BoardRoutes = router;
