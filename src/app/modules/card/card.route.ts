import express from 'express';
import auth from '../../middlewares/auth';
import { CardController } from './card.controller';

const router = express.Router();

router.post('/', auth(), CardController.createCard);
router.get('/:id', auth(), CardController.getAllCards);
router.patch('/:id/list', auth(), CardController.updateListId);

export const CardRoutes = router;
