import express from 'express';
import auth from '../../middlewares/auth';
import { ChecklistController } from './checklist.controller';

const router = express.Router();

router.post('/', auth(), ChecklistController.createChecklist);
router.patch('/:id', auth(), ChecklistController.updateChecklistTitle);
router.get('/:id/card', auth(), ChecklistController.getAllChecklist);

export const ChecklistRoutes = router;
