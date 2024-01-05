import express from 'express';
import { TemplateController } from './template.controller';

const router = express.Router();

router.post('/', TemplateController.insertIntoDB);
router.get('/', TemplateController.getAllFromDB);
router.get('/:id', TemplateController.getSingleData);
router.patch('/:id', TemplateController.updateSingleData);
router.delete('/:id', TemplateController.deleteSingleData);

export const TemplateRoutes = router;
