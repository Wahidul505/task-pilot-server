"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const card_controller_1 = require("./card.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(), card_controller_1.CardController.createCard);
router.get('/:id', (0, auth_1.default)(), card_controller_1.CardController.getAllCards);
router.patch('/:id', (0, auth_1.default)(), card_controller_1.CardController.updateSingleCard);
router.patch('/:id/list', (0, auth_1.default)(), card_controller_1.CardController.updateListId);
router.post('/:id/member', (0, auth_1.default)(), card_controller_1.CardController.addCardMember);
router.delete('/:id/member', (0, auth_1.default)(), card_controller_1.CardController.removeCardMember);
exports.CardRoutes = router;
