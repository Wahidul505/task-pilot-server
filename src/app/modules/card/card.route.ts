import express from 'express';
import auth from '../../middlewares/auth';
import { CardController } from './card.controller';

const router = express.Router();

router.post('/', auth(), CardController.createCard);
router.get('/:id', auth(), CardController.getAllCards);
router.patch('/:id', auth(), CardController.updateSingleCard);
router.delete('/:id', auth(), CardController.removeSingleCard);
router.patch('/:id/list', auth(), CardController.updateListId);
router.post('/:id/member', auth(), CardController.addCardMember);
router.delete('/:id/member', auth(), CardController.removeCardMember);

export const CardRoutes = router;
