import { QueryOrder } from '@mikro-orm/better-sqlite';
import type {Context} from 'koa';
import Router from 'koa-router';

import { DI } from '../server';
import { z } from 'zod';
import {Task} from '../entities';

const router = new Router();

router.get('/', async (ctx: Context) => {
  ctx.body = await DI.tasks.findAll({
    orderBy: { name: QueryOrder.DESC }
  });
});

router.get('/:status', async (ctx: Context) => {
  try {
    const params = z.object({ status: z.boolean() }).parse(ctx['params']);
    const task = await DI.tasks.find( {status:params.status});

    if (!task) {
      return ctx.throw(404, { message: 'No task was found' });
    }

    ctx.body = task;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.post('/', async (ctx: Context) => {
  if (!ctx.request.body.name || !ctx.request.body.date) {
    return ctx.throw(400, { message: 'One of `name, date` is missing' });
  }

  try {
    const task = DI.em.create(Task, ctx.request.body);
    await DI.em.flush();

    ctx.body = task;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.put('/:id', async (ctx: Context) => {
  try {
    const params = z.object({ id: z.number() }).parse(ctx['params']);
    const task = await DI.tasks.findOne(params.id);

    if (!task) {
      return ctx.throw(404, { message: 'Task not found' });
    }

    DI.em.assign(Task, ctx.request.body);
    await DI.em.flush();

    ctx.body = task;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

export const TaskController = router;
