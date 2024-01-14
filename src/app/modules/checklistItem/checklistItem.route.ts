import express from 'express';
import auth from '../../middlewares/auth';
import { ChecklistItemController } from './checklistItem.controller';

const router = express.Router();

router.post('/', auth(), ChecklistItemController.createChecklistItem);

export const ChecklistItemRoutes = router;
