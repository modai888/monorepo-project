/**
 * 测试`References`装饰器
 */
import { Model, DataTypes } from 'sequelize';
import { References } from './references';
import { Table } from './table';
import { Column } from './column';

@Table
class Parent extends Model {
    @Column({
        type: DataTypes.UUID,
        field: 'parent_id',
    })
    public id!: string;
}

test('可以使用模型类定义字段引用约束', () => {
    @Table
    class Child extends Model {
        @References({
            model: Parent,
            key: 'id',
        })
        public userId!: string;
    }

    const options = References.getOptions(Child.prototype, 'userId');
    expect(options).not.toBeUndefined();
    expect(options).toEqual({
        model: 'parent',
        key: 'parent_id',
    });
});

test('当字段引用参数的model字段设置为模型类时，key字段可以是所引用模型的属性或者模型对应表的字段名', () => {
    @Table
    class Child extends Model {
        @References({
            model: Parent,
            key: 'id',
        })
        public userId!: string;
    }

    @Table
    class Child2 extends Model {
        @References({
            model: Parent,
            key: 'parent_id',
        })
        public userId!: string;
    }

    const options = References.getOptions(Child.prototype, 'userId');
    const options2 = References.getOptions(Child2.prototype, 'userId');
    expect(options).toEqual(options2);
    expect(options).toEqual({
        model: 'parent',
        key: 'parent_id',
    });
});

test('当字段引用参数的model字段设置为模型名称或者表名称时，key字段只能是模型对应表的字段名', () => {
    @Table
    class Child extends Model {
        @References({
            model: Parent.name,
            // 当model字段是模型或表名字时，key只能是表字段名字
            key: 'parent_id',
        })
        public userId!: string;
    }

    @Table
    class Child2 extends Model {
        @References({
            model: Parent.name,
            // 当model字段是模型或表名字时，key只能是表字段名字
            key: 'id',
        })
        public userId!: string;
    }

    const options = References.getOptions(Child.prototype, 'userId');
    const options2 = References.getOptions(Child2.prototype, 'userId');
    expect(options).not.toEqual(options2);
    expect(options).toEqual({
        model: 'parent',
        key: 'parent_id',
    });
    expect(options2).toEqual({
        model: 'parent',
        key: 'id',
    });
});
