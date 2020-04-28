/**
 * 用户账号模型定义
 */
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Table, Column, References } from '../core/decorator';
import { User } from './user';

@Table<UserAccount>({})
export class UserAccount extends Model {
    /**
     * 记录标识，自增主键
     */
    @Column({
        type: DataTypes.BIGINT({ length: 11, zerofill: true }).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    })
    public id!: number;

    /**
     * 用户标识
     */
    @Column({
        type: DataTypes.UUID,
        allowNull: false,
    })
    @References({
        model: User,
        key: 'id', // 当model字段指定为模型类时，key字段可以是模型类中定义的属性字段名，也可以是模型类对应表的字段名
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    public userId!: string;

    /**
     * 登录类型
     *
     * 手机号/邮箱 或第三方应用名称 (微信/微博等)
     */
    @Column({
        type: DataTypes.STRING(32),
        allowNull: false,
    })
    public identityType!: string;

    /**
     * 账号唯一标识
     *
     * 手机号/邮箱/第三方的唯一标识
     */
    @Column({
        type: DataTypes.STRING(255),
        allowNull: false,
    })
    public identifier!: string;

    /**
     * 密码凭证
     *
     * 自建账号的保存密码, 第三方的保存 token
     */
    @Column({
        field: 'credential',
        type: DataTypes.STRING(255),
        allowNull: false,
    })
    public credential!: string;

    /**
     * 账号是否已验证
     */
    @Column({
        type: DataTypes.TINYINT({ length: 1 }),
        allowNull: false,
    })
    public verified!: number;
}
