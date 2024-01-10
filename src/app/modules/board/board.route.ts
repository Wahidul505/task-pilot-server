import express from 'express';
import auth from '../../middlewares/auth';
import { BoardController } from './board.controller';

const router = express.Router();

router.get('/member', auth(), BoardController.getAllBoardsOfMember);
router.post('/:id/member', auth(), BoardController.addBoardMembers);
router.delete('/:id/member', auth(), BoardController.removeBoardMember);
router.post('/', auth(), BoardController.insertIntoDB);
router.get('/:id', auth(), BoardController.getSingleData);
router.patch('/:id/title', auth(), BoardController.updateBoardTitle);

export const BoardRoutes = router;
