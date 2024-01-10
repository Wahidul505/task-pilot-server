"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const list_controller_1 = require("./list.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(), list_controller_1.ListController.createList);
router.get('/:id', (0, auth_1.default)(), list_controller_1.ListController.getSingleList);
router.get('/:id/board', (0, auth_1.default)(), list_controller_1.ListController.getAllLists);
router.patch('/:id/title', (0, auth_1.default)(), list_controller_1.ListController.updateListTitle);
router.delete('/:id', (0, auth_1.default)(), list_controller_1.ListController.deleteSingleList);
exports.ListRoutes = router;
