import express from 'express';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/:id', auth(), UserController.getSingleData);

router.patch('/:id', auth(), UserController.updateSingleData);

export const UserRoutes = router;
