import express from 'express';
import { WorkspaceController } from './workspace.controller';

const router = express.Router();

router.post('/', WorkspaceController.insertIntoDB);

export const WorkspaceRoutes = router;
