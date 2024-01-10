"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateRoutes = void 0;
const express_1 = __importDefault(require("express"));
const template_controller_1 = require("./template.controller");
const router = express_1.default.Router();
router.post('/', template_controller_1.TemplateController.insertIntoDB);
router.get('/', template_controller_1.TemplateController.getAllFromDB);
router.get('/:id', template_controller_1.TemplateController.getSingleData);
router.patch('/:id', template_controller_1.TemplateController.updateSingleData);
router.delete('/:id', template_controller_1.TemplateController.deleteSingleData);
exports.TemplateRoutes = router;
