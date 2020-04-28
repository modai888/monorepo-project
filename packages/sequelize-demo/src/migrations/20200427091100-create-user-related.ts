/**
 * Migration
 */
import { QueryInterface, Model, QueryTypes } from 'sequelize';
import { Migration } from '../core';
import { Table } from '../core/decorator';
import { ModelClass } from '../core/types';

import { User, UserAccount } from '../models';

export async function up(query: QueryInterface) {
    const models: ModelClass<Model>[] = [User, UserAccount];
    const transaction = await query.sequelize.transaction();
    // 创建表
    try {
        for (let model of models) {
            await Migration.createTableForModel(model, query, transaction);
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error('[Migration Error]: ');
        console.error(error);
        throw error;
    }
}

export async function down(query: QueryInterface) {
    const models: ModelClass<Model>[] = [UserAccount, User];
    // 删除表
    const transaction = await query.sequelize.transaction();
    try {
        await query.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { type: QueryTypes.RAW, transaction });
        for (let model of models) {
            const options = Table.getOptions(model);
            if (!options) {
                throw new Error(`模型上缺失Model Options定义，请使用Table装饰器进行定义`);
            }
            console.log(options.tableName!);
            // drop table
            await query.dropTable(options.tableName!, { transaction });
        }
        await query.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { type: QueryTypes.RAW, transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error('[Migration rollup Error]: ');
        console.error(error);
        throw error;
    }
}
