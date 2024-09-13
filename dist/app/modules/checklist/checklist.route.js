"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const checklist_controller_1 = require("./checklist.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(), checklist_controller_1.ChecklistController.createChecklist);
router.patch('/:id', (0, auth_1.default)(), checklist_controller_1.ChecklistController.updateChecklistTitle);
router.get('/:id/card', (0, auth_1.default)(), checklist_controller_1.ChecklistController.getAllChecklist);
router.delete('/:id', (0, auth_1.default)(), checklist_controller_1.ChecklistController.deleteSingleChecklist);
exports.ChecklistRoutes = router;
