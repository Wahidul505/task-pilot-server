import express from 'express';
import auth from '../../middlewares/auth';
import { ChecklistItemController } from './checklistItem.controller';

const router = express.Router();

router.post('/', auth(), ChecklistItemController.createChecklistItem);
router.patch('/:id', auth(), ChecklistItemController.updateSingleChecklistItem);
router.delete(
  '/:id',
  auth(),
  ChecklistItemController.deleteSingleChecklistItem
);

export const ChecklistItemRoutes = router;
