"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistItemRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checklistItem_controller_1 = require("./checklistItem.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(), checklistItem_controller_1.ChecklistItemController.createChecklistItem);
router.patch('/:id', (0, auth_1.default)(), checklistItem_controller_1.ChecklistItemController.updateSingleChecklistItem);
router.delete('/:id', (0, auth_1.default)(), checklistItem_controller_1.ChecklistItemController.deleteSingleChecklistItem);
exports.ChecklistItemRoutes = router;
