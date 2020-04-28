/**
 * 声明类型
 */
import { Model, ModelType } from 'sequelize';

/**
 * 定义Model类类型
 */
export type ModelClass<M extends Model> = { new (...args: any[]): M } & ModelType & Function;
