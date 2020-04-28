/**
 * Column decorator
 */
import 'reflect-metadata';
import { ModelAttributeColumnReferencesOptions, Model, Utils } from 'sequelize';
import { Column } from './column';
import { Table } from './table';
import { ModelClass } from '../types';

/**
 * 列引用选项
 */
export interface ColumnReferencesOptions extends ModelAttributeColumnReferencesOptions {
    /**
     * What should happen when the referenced key is updated. One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or
     * NO ACTION
     */
    onUpdate?: 'CASCADE' | 'RESTRICT' | 'SET DEFAULT' | 'SET NULL' | 'NO ACTION';

    /**
     * What should happen when the referenced key is deleted. One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or
     * NO ACTION
     */
    onDelete?: 'CASCADE' | 'RESTRICT' | 'SET DEFAULT' | 'SET NULL' | 'NO ACTION';
}

/**
 * 为模型字段定义引用约束
 * @param options
 */
export function References(options: ColumnReferencesOptions): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        if (!options.model) {
            throw new Error('在字段引用设置时，引用模型字段不能为空!!!');
        }

        // 解析model和key，支持直接用模型的名字和字段进行引用定义
        let model = options.model;
        let key = options.key;
        if (typeof model !== 'string') {
            let DBModel = model as ModelClass<Model>;
            // 解析引用模型的相关信息
            let options = Table.getOptions<Model>(DBModel);
            if (options) {
                model = options.tableName!;
            }

            if (key) {
                let options = Column.getOptions(DBModel.prototype, key);
                if (options && options.field) {
                    key = options.field;
                }
            }
        } else {
            // 转换为下划线连接的形式
            model = Utils.underscoredIf(model, true);
        }

        Reflect.defineMetadata('sequelize_column_references', { ...options, model, key }, target, propertyKey);
    };
}

export namespace References {
    /**
     * 获取对象或其原型链上定义的引用约束参数
     */
    export function getOptions(target: Object, propertyKey: string | symbol): ColumnReferencesOptions | undefined {
        return Reflect.getMetadata('sequelize_column_references', target, propertyKey);
    }
}
