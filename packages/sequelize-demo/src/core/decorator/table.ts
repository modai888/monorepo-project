/**
 * Table decorator
 */
import 'reflect-metadata';
import { Model, ModelOptions, Utils } from 'sequelize';
import { ModelClass } from '../types';

/**
 * 默认选项
 */
export const DEFAULT_TABLE_OPTIONS: ModelOptions = {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: false,
    underscored: true,
};

/**
 * 模型装饰器工厂
 */
function ModelFactory(Ctor: ModelClass<any>, options: ModelOptions<Model> = {}) {
    // 标准化表名
    let tableName = options.tableName || Utils.underscoredIf(Ctor.name, true);
    options = { ...DEFAULT_TABLE_OPTIONS, ...options, modelName: Ctor.name, tableName };
    Reflect.defineMetadata('sequelize_table_model', options, Ctor);

    return Ctor;
}

/**
 * Table decorator
 *
 * 用于为模型定义ModelOptions
 */
export function Table<M extends Model = Model>(ctor: ModelClass<M>): ModelClass<M>;
export function Table<M extends Model = Model>(options: ModelOptions<M>): (ctor: ModelClass<M>) => ModelClass<M>;
export function Table(options: any): any {
    if (typeof options === 'function') {
        return ModelFactory(options);
    }

    return (ctor: any) => {
        return ModelFactory(ctor, options);
    };
}

export namespace Table {
    /**
     * 获取对象或其原型链上定义的元数据
     */
    export function getOptions<M extends Model>(target: ModelClass<M>): ModelOptions<M> | undefined {
        return Reflect.getMetadata('sequelize_table_model', target) as ModelOptions<M>;
    }
}
