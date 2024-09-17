import express from 'express';
import auth from '../../middlewares/auth';
import { CollabController } from './collab.controller';

const router = express.Router();

router.post('/', auth(), CollabController.collabRequest);
router.patch('/:collabQueueId', auth(), CollabController.collabAction);
router.get('/', auth(), CollabController.getUserReceivedCollabRequests);
router.get('/:id', auth(), CollabController.getSingleCollab);

export const CollabRoutes = router;
