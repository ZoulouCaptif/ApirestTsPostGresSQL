"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const better_sqlite_1 = require("@mikro-orm/better-sqlite");
const koa_router_1 = __importDefault(require("koa-router"));
const server_1 = require("../server");
const zod_1 = require("zod");
const entities_1 = require("../entities");
const router = new koa_router_1.default();
router.get('/', async (ctx) => {
    ctx.body = await server_1.DI.tasks.findAll({
        orderBy: { name: better_sqlite_1.QueryOrder.DESC }
    });
});
router.get('/:status', async (ctx) => {
    try {
        const params = zod_1.z.object({ status: zod_1.z.boolean() }).parse(ctx['params']);
        const task = await server_1.DI.tasks.find({ status: params.status });
        if (!task) {
            return ctx.throw(404, { message: 'No task was found' });
        }
        ctx.body = task;
    }
    catch (e) {
        console.error(e);
        return ctx.throw(400, { message: e.message });
    }
});
router.post('/', async (ctx) => {
    if (!ctx.request.body.name || !ctx.request.body.date) {
        return ctx.throw(400, { message: 'One of `name, date` is missing' });
    }
    try {
        const task = server_1.DI.em.create(entities_1.Task, ctx.request.body);
        await server_1.DI.em.flush();
        ctx.body = task;
    }
    catch (e) {
        console.error(e);
        return ctx.throw(400, { message: e.message });
    }
});
router.put('/:id', async (ctx) => {
    try {
        const params = zod_1.z.object({ id: zod_1.z.number() }).parse(ctx['params']);
        const task = await server_1.DI.tasks.findOne(params.id);
        if (!task) {
            return ctx.throw(404, { message: 'Task not found' });
        }
        server_1.DI.em.assign(entities_1.Task, ctx.request.body);
        await server_1.DI.em.flush();
        ctx.body = task;
    }
    catch (e) {
        console.error(e);
        return ctx.throw(400, { message: e.message });
    }
});
exports.TaskController = router;
