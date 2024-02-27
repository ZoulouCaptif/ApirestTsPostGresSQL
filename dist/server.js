"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Console = __importStar(require("console"));
const cors = require('@koa/cors');
exports.DI = {};
exports.app = new koa_1.default();
// Entry point for all modules.
const api = new koa_router_1.default();
api.use('/Tasks', controllers_1.TaskController.routes());
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
    Console.log("DI.tasks)");
    await exports.DI.orm.schema.updateSchema();
    exports.app.use((0, koa_body_1.koaBody)());
    exports.app.use((ctx, next) => postgresql_1.RequestContext.create(exports.DI.orm.em, next));
    exports.app.use(cors({
        origin: 'http://localhost:4200', // Only allow requests from this origin
    }));
    exports.app.use(api.routes());
    exports.app.use(api.allowedMethods());
    exports.app.use((ctx, next) => {
        ctx.status = 404;
        ctx.body = { message: 'No route found' };
    });
    exports.app.listen(port);
})();
