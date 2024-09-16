import express, { Request, Response } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BoardRoutes } from '../modules/board/board.route';
import { CardRoutes } from '../modules/card/card.route';
import { ChecklistRoutes } from '../modules/checklist/checklist.route';
import { ChecklistItemRoutes } from '../modules/checklistItem/checklistItem.route';
import { CollabRoutes } from '../modules/collab/collab.route';
import { CommentRoutes } from '../modules/comment/comment.route';
import { ListRoutes } from '../modules/list/list.route';
import { TemplateRoutes } from '../modules/template/template.route';
import { ThemeRoutes } from '../modules/theme/theme.route';
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
    path: '/theme',
    route: ThemeRoutes,
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
    path: '/collab',
    route: CollabRoutes,
  },
  {
    path: '/list',
    route: ListRoutes,
  },
  {
    path: '/card',
    route: CardRoutes,
  },
  {
    path: '/comment',
    route: CommentRoutes,
  },
  {
    path: '/checklist',
    route: ChecklistRoutes,
  },
  {
    path: '/checklist-item',
    route: ChecklistItemRoutes,
  },
  {
    path: '/',
    route: (req: Request, res: Response) => res.send('Task Pilot lunched'),
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
