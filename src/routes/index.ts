import { Router } from 'express';

import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import postsRouter from './posts.routes';


import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', ensureAuthenticated, sessionsRouter);
routes.use('/posts', ensureAuthenticated, postsRouter);

export default routes;