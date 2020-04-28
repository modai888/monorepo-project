/**
 * Column decorator
 */
import 'reflect-metadata';
import { ModelAttributeColumnOptions, Utils } from 'sequelize';
import { References, ColumnReferencesOptions } from './references';

export function Column(options: ModelAttributeColumnOptions): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        const columns = Reflect.getOwnMetadata('sequelize_columns', target) || [];
        columns.push(propertyKey);
        Reflect.defineMetadata('sequelize_columns', columns, target);
        // column options
        let field = options.field || Utils.underscoredIf(<string>propertyKey, true);
        options = { ...options, field };
        Reflect.defineMetadata('sequelize_column_property', options, target, propertyKey);
    };
}

export namespace Column {
    /**
     * 列举对象上定义的所有字段列表
     * @param target
     */
    export function list(target: Object): string[] {
        return Reflect.getMetadata('sequelize_columns', target) || [];
    }

    /**
     * 获取对象或其原型链上定义的元数据
     */
    export function getOptions(target: Object, propertyKey: string | symbol): ModelAttributeColumnOptions | undefined {
        let references = References.getOptions(target, propertyKey);
        let options = Reflect.getMetadata('sequelize_column_property', target, propertyKey);
        return mergeReferences(options, references);
    }

    /**
     * 获取对象上定义的元数据
     */
    export function getOwnOptions(
        target: Object,
        propertyKey: string | symbol
    ): ModelAttributeColumnOptions | undefined {
        let references = References.getOptions(target, propertyKey);
        let options = Reflect.getOwnMetadata('sequelize_column_property', target, propertyKey);
        return mergeReferences(options, references);
    }

    /**
     * 私有方法
     */
    function mergeReferences(options: ModelAttributeColumnOptions, references?: ColumnReferencesOptions) {
        if (!options) {
            return options;
        }

        // 合并引用字段设置
        if (references) {
            let { model, key, deferrable } = references;
            options.references = Object.assign(options.references || {}, { model, key, deferrable });
            options.onDelete = references.onDelete;
            options.onUpdate = references.onUpdate;
        }
        return options;
    }
}
