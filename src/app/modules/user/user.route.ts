import express from 'express';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/:id', auth(), UserController.getDataById);

router.patch('/:id', auth(), UserController.updateData);

export const UserRoutes = router;
