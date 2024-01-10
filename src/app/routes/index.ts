import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BoardRoutes } from '../modules/board/board.route';
import { CardRoutes } from '../modules/card/card.route';
import { ListRoutes } from '../modules/list/list.route';
import { TemplateRoutes } from '../modules/template/template.route';
import { UserRoutes } from '../modules/user/user.route';
import { WorkspaceRoutes } from '../modules/workspace/workspace.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/template',
    route: TemplateRoutes,
  },
  {
    path: '/workspace',
    route: WorkspaceRoutes,
  },
  {
    path: '/board',
    route: BoardRoutes,
  },
  {
    path: '/list',
    route: ListRoutes,
  },
  {
    path: '/card',
    route: CardRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
