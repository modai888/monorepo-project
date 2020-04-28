/**
 * 连接数据库
 */
import { Sequelize, Options, Model, ModelAttributeColumnOptions } from 'sequelize';
import { Column, Table } from './decorator';
import { ModelClass } from './types';
// import { User, UserAccount } from './models';

// const models: { [key: string]: ModelClass<Model> } = {
//     User,
//     UserAccount,
// };

export function SequelizeIt(options: Options, models: { [key: string]: ModelClass<Model> }) {
    const sequelize = new Sequelize(options);
    // 初始化模型
    // console.log(Column.getOptions(User.prototype, 'id'))

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

        // 初始化模型
        DBModel.init(columns, { ...modelOptions, sequelize });
    });

    return sequelize;
}
