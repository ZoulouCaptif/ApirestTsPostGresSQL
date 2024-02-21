"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.DI = void 0;
require("reflect-metadata");
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_body_1 = require("koa-body");
const postgresql_1 = require("@mikro-orm/postgresql");
const controllers_1 = require("./controllers");
const entities_1 = require("./entities");
exports.DI = {};
exports.app = new koa_1.default();
// Entry point for all modules.
const api = new koa_router_1.default();
api.use('/Task', controllers_1.TaskController.routes());
const port = process.env['PORT'] || 3000;
(async () => {
    exports.DI.orm = await postgresql_1.MikroORM.init({
        entities: [entities_1.Task],
        user: 'postgres',
        password: "password123",
        host: "localhost",
        port: 5432,
        dbName: "my_database",
    }); // CLI config will be used automatically
    exports.DI.em = exports.DI.orm.em;
    exports.DI.tasks = exports.DI.orm.em.getRepository(entities_1.Task);
    await exports.DI.orm.schema.updateSchema();
    exports.app.use((0, koa_body_1.koaBody)());
    exports.app.use((ctx, next) => postgresql_1.RequestContext.create(exports.DI.orm.em, next));
    exports.app.use(api.routes());
    exports.app.use(api.allowedMethods());
    exports.app.use((ctx, next) => {
        ctx.status = 404;
        ctx.body = { message: 'No route found' };
    });
    exports.app.listen(port);
})();
