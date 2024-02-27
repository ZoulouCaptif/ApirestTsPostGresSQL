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
  console.log("task");
  console.log("params.status");
  try {
    const status = ctx.params.status === 'true';
    const task = await DI.tasks.find({ status: status });

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
    const id = parseInt(ctx.params.id, 10); // Convertit l'ID de la tâche de string à number
    const task = await DI.tasks.findOne({ id: id });

    if (!task) {
      return ctx.throw(404, { message: 'Task not found' });
    }

    task.status = !task.status; // Change the status of the task

    await DI.em.persistAndFlush(task); // Save the changes

    ctx.body = task;
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});

router.delete('/:id', async (ctx: Context) => {
  try {
    const id = parseInt(ctx.params.id, 10); // Convertit l'ID de la tâche de string à number
    const task = await DI.tasks.findOne({ id: id });

    if (!task) {
      return ctx.throw(404, { message: 'Task not found' });
    }

    await DI.em.removeAndFlush(task); // Supprime la tâche trouvée

    ctx.status = 200; // Réponse HTTP pour indiquer que la requête a réussi
    ctx.body = { message: 'Task deleted successfully' };
  } catch (e: any) {
    console.error(e);
    return ctx.throw(400, { message: e.message });
  }
});


export const TaskController = router;
