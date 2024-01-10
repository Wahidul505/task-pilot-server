import express from 'express';
import auth from '../../middlewares/auth';
import { ListController } from './list.controller';

const router = express.Router();

router.post('/', auth(), ListController.createList);
router.get('/:id', auth(), ListController.getSingleList);
router.get('/:id/board', auth(), ListController.getAllLists);
router.patch('/:id/title', auth(), ListController.updateListTitle);
router.delete('/:id', auth(), ListController.deleteSingleList);

export const ListRoutes = router;
