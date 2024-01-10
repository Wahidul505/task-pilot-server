"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const board_controller_1 = require("./board.controller");
const router = express_1.default.Router();
router.get('/member', (0, auth_1.default)(), board_controller_1.BoardController.getAllBoardsOfMember);
router.post('/:id/member', (0, auth_1.default)(), board_controller_1.BoardController.addBoardMembers);
router.delete('/:id/member', (0, auth_1.default)(), board_controller_1.BoardController.removeBoardMember);
router.post('/', (0, auth_1.default)(), board_controller_1.BoardController.insertIntoDB);
router.get('/:id', (0, auth_1.default)(), board_controller_1.BoardController.getSingleData);
router.patch('/:id/title', (0, auth_1.default)(), board_controller_1.BoardController.updateBoardTitle);
exports.BoardRoutes = router;
