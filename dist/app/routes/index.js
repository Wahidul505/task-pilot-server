"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const board_route_1 = require("../modules/board/board.route");
const card_route_1 = require("../modules/card/card.route");
const list_route_1 = require("../modules/list/list.route");
const template_route_1 = require("../modules/template/template.route");
const user_route_1 = require("../modules/user/user.route");
const workspace_route_1 = require("../modules/workspace/workspace.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/template',
        route: template_route_1.TemplateRoutes,
    },
    {
        path: '/workspace',
        route: workspace_route_1.WorkspaceRoutes,
    },
    {
        path: '/board',
        route: board_route_1.BoardRoutes,
    },
    {
        path: '/list',
        route: list_route_1.ListRoutes,
    },
    {
        path: '/card',
        route: card_route_1.CardRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
