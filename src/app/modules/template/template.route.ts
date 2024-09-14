import express from 'express';
import auth from '../../middlewares/auth';
import { TemplateController } from './template.controller';

const router = express.Router();

router.post('/', auth(), TemplateController.createTemplate);
router.get('/', auth(), TemplateController.getAllTemplatesOfSingleUser);

export const TemplateRoutes = router;
