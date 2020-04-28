/**
 * 核心工具方法
 */
import {
    Model,
    ModelAttributeColumnOptions,
    ModelOptions,
    ModelAttributes,
    Sequelize,
    QueryInterface,
    Transaction,
} from 'sequelize';
import { Table, Column } from './decorator';
import { ModelClass } from './types';

/**
 * 获取定义在模型上的所有属性信息
 * @param models
 */
export function getOptionsFromModel(models: { [key: string]: ModelClass<Model> }, sequelize?: Sequelize) {
    const options: { [key: string]: [ModelOptions | undefined, ModelAttributes] } = Object.create(null);
    Object.keys(models).forEach((model: string) => {
        const DBModel = models[model];
        const modelOptions = Table.getOptions(DBModel);
        // 遍历属性
        const columns: { [key: string]: ModelAttributeColumnOptions } = {};

        Column.list(DBModel.prototype).forEach((column: string) => {
            // 获取属性字段上定义的列元数据
            let columnOptions = Column.getOptions(DBModel.prototype, column);

            if (columnOptions) {
                columns[column] = columnOptions;
            }
        });

        if (sequelize) {
            DBModel.init(columns, { ...modelOptions, sequelize });
        }
        options[model] = [modelOptions, columns];
    });

    return options;
}

/**
 * 规范化表格名称
 */
export function normalizeTableName(options: ModelOptions) {
    let name = options.tableName || options.modelName || '';
    if (name) {
        return name
            .replace(/[A-Z]/g, (char: string) => {
                return '_' + char.toLocaleLowerCase();
            })
            .replace(/^_/, '');
    }

    return name;
}

/**
 * 数据迁移工具集合
 */
export namespace Migration {
    /**
     * 基于模型创建表
     * @param model
     * @param query
     * @param transaction
     */
    export async function createTableForModel<M extends Model>(
        model: ModelClass<M>,
        query: QueryInterface,
        transaction: Transaction
    ) {
        const options = Table.getOptions(model);
        // 遍历属性
        const columns: { [key: string]: ModelAttributeColumnOptions } = {};
        Column.list(model.prototype).forEach((column: string) => {
            // 获取属性字段上定义的列元数据
            let columnOptions = Column.getOptions(model.prototype, column);
            if (columnOptions) {
                columns[column] = columnOptions;
            }
        });
        // init
        model.init(columns, { ...options, sequelize: query.sequelize });
        // create table
        await query.createTable(options!.tableName!, columns, { ...options, transaction });
    }

    /**
     * 基于模型定义删除数据表
     * @param model
     * @param query
     * @param transaction
     */
    export async function dropTableForModel<M extends Model>(
        model: ModelClass<M>,
        query: QueryInterface,
        transaction: Transaction
    ) {
        const options = Table.getOptions(model);
        if (!options) {
            throw new Error(`模型上缺失Model Options定义，请使用Table装饰器进行定义`);
        }
        // 遍历属性
        const columns: { [key: string]: ModelAttributeColumnOptions } = {};
        Column.list(model.prototype).forEach((column: string) => {
            // 获取属性字段上定义的列元数据
            let columnOptions = Column.getOptions(model.prototype, column);
            if (columnOptions) {
                columns[column] = columnOptions;
            }
        });
        // init
        model.init(columns, { ...options, sequelize: query.sequelize });
        // drop table
        await query.dropTable(options.tableName!, { force: false, cascade: false, transaction });
    }
}
