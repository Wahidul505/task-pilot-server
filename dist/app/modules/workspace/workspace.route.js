"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const workspace_controller_1 = require("./workspace.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(), workspace_controller_1.WorkspaceController.insertIntoDB);
router.get('/', workspace_controller_1.WorkspaceController.getAllFromDB);
router.get('/admin', (0, auth_1.default)(), workspace_controller_1.WorkspaceController.getAllWorkspacesOfAdmin);
router.get('/guest', (0, auth_1.default)(), workspace_controller_1.WorkspaceController.getAllWorkspacesOfGuest);
router.get('/:id', (0, auth_1.default)(), workspace_controller_1.WorkspaceController.getSingleFromDB);
router.patch('/:id', (0, auth_1.default)(), workspace_controller_1.WorkspaceController.updateSingleData);
router.post('/:id/admin', (0, auth_1.default)(), workspace_controller_1.WorkspaceController.addWorkspaceAdmins);
router.delete('/:id/admin', (0, auth_1.default)(), workspace_controller_1.WorkspaceController.removeWorkspaceAdmin);
exports.WorkspaceRoutes = router;
