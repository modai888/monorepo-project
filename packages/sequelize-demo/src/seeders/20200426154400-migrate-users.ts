/**
 * 从旧表迁移用户数据
 */
import { QueryInterface, ModelAttributeColumnOptions, TINYINT, Sequelize, QueryTypes } from 'sequelize';
import { Table, Column } from '../core/decorator';
import { User } from '../models';

export async function up(query: QueryInterface, sequelize: Sequelize) {
    // let ret: LegacyUser[] = await (<Function>query.rawSelect)('user_bak', { plain: false, offset: 0, limit: 500 }, '');
    // let n = 0;
    // while (ret.length > 0) {
    //     let records = ret.map(r => {
    //         return {
    //             user_id: r.UserId,
    //             user_name: r.LoginName,
    //             avatar_url: r.HeadImg,
    //             phone: `(${r.PhoneCode})${r.Phone}`,
    //             email: r.Email,
    //             created_at: r.CreateTime,
    //             updated_at: r.CreateTime,
    //         };
    //     });
    //     await query.bulkInsert('user', records, {});
    //     n++;
    //     ret = await (<Function>query.rawSelect)('user_bak', { plain: false, offset: n * 500, limit: 500 }, '');
    // }
}

export async function down(query: QueryInterface) {
    await query.bulkDelete('user', {}, {});
}
