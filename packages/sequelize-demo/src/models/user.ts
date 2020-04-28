/**
 * 用户模型定义
 */
import { Model, DataTypes } from 'sequelize';
import { Table, Column } from '../core/decorator';

/**
 * 用户模型
 */
@Table
export class User extends Model {
    /**
     * 用户唯一标识
     */
    @Column({
        field: 'user_id',
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        comment: '用户唯一标识',
    })
    public id!: string;

    /**
     * 用户昵称
     */
    @Column({
        field: 'nickname',
        type: DataTypes.STRING(64),
        comment: '用户昵称',
    })
    public nickname!: string;

    /**
     * 用户头像
     */
    @Column({
        field: 'avatar_url',
        type: DataTypes.STRING(255),
        comment: '用户头像存储地址',
    })
    public avatar!: string;

    /**
     * 用户手机号
     */
    @Column({
        field: 'phone',
        type: DataTypes.STRING(16),
        comment: '手机号码，包含区号',
    })
    public phone!: string;

    /**
     * 用户电子邮箱
     */
    @Column({
        field: 'email',
        type: DataTypes.STRING(64),
        comment: '电子邮件',
    })
    public email!: string;

    /**
     * 创建时间
     */
    @Column({
        field: 'created_at',
        type: DataTypes.DATE,
        comment: '记录创建时间',
    })
    public createdAt!: Date;

    /**
     * 最后更新时间
     */
    @Column({
        field: 'updated_at',
        type: DataTypes.DATE,
        comment: '最后更新时间',
    })
    public updatedAt!: Date;
}
