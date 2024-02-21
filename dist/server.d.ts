import 'reflect-metadata';
import Koa from 'koa';
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/postgresql';
import { Task } from './entities';
export declare const DI: {
    orm: MikroORM;
    em: EntityManager;
    tasks: EntityRepository<Task>;
};
export declare const app: Koa<Koa.DefaultState, Koa.DefaultContext>;
