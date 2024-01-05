import express from 'express';
import { WorkspaceController } from './workspace.controller';

const router = express.Router();

router.post('/', WorkspaceController.insertIntoDB);
router.get('/', WorkspaceController.getAllFromDB);

export const WorkspaceRoutes = router;
