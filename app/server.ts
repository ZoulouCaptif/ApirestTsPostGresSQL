import 'reflect-metadata';

import Koa from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/postgresql';

import { TaskController } from './controllers';
import { Task } from './entities';

export const DI = {} as {
  orm: MikroORM,
  em: EntityManager,
  tasks: EntityRepository<Task>,
};

export const app = new Koa();

// Entry point for all modules.
const api = new Router();
api.use('/Task', TaskController.routes());

const port = process.env['PORT'] || 3000;

(async () => {
  DI.orm = await MikroORM.init(
    {
        entities: [Task],
        user: 'postgres',
        password: "password123",
        host: "localhost",
        port: 5432,
        dbName: "my_database",
    }
  ); // CLI config will be used automatically
  DI.em = DI.orm.em;
  DI.tasks = DI.orm.em.getRepository(Task);

  await DI.orm.schema.updateSchema();

  app.use(koaBody());
  app.use((ctx, next) => RequestContext.create(DI.orm.em, next));
  app.use(api.routes());
  app.use(api.allowedMethods());
  app.use((ctx, next) => {
    ctx.status = 404;
    ctx.body = { message: 'No route found' };
  });

  app.listen(port);
})();
