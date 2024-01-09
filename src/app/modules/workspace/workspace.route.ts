import express from 'express';
import auth from '../../middlewares/auth';
import { WorkspaceController } from './workspace.controller';

const router = express.Router();

router.post('/', auth(), WorkspaceController.insertIntoDB);
router.get('/', WorkspaceController.getAllFromDB);
router.get('/admin', auth(), WorkspaceController.getAllWorkspacesOfAdmin);
router.get('/:id', auth(), WorkspaceController.getSingleFromDB);
router.patch('/:id', auth(), WorkspaceController.updateSingleData);

export const WorkspaceRoutes = router;
