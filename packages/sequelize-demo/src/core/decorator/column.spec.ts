import { DataTypes, Model } from 'sequelize';
import { Column } from './column';
import { Table } from './table';

// test(`the "target" parameter of PropertyDecorator is class prototype`, () => {
//     function decorator(target: any, property: string | symbol) {
//         expect(target).toEqual(A.prototype);
//     }
//     class A {
//         @decorator
//         public prop!: string;
//     }
// });

test('has `sequelize_column_property` metadata key', () => {
    class Foobar {
        @Column({
            type: DataTypes.STRING(64),
        })
        public name!: string;
    }

    const propKeys = Reflect.getMetadataKeys(Foobar.prototype, 'name');
    expect(propKeys).toContain('sequelize_column_property');
});

test('add column options', () => {
    class Foobar {
        @Column({
            field: 'user_name',
            type: DataTypes.STRING(64),
        })
        public name!: string;
    }

    const options = Column.getOptions(Foobar.prototype, 'name');
    expect(options).toHaveProperty('field', 'user_name');
});

test('can work with table decorator', () => {
    @Table<Foobar>({
        tableName: 'foobar',
    })
    class Foobar extends Model {
        @Column({
            field: 'user_age',
            type: DataTypes.STRING(64),
        })
        public age!: string;
    }

    const options = Column.getOptions(Foobar.prototype, 'age');
    expect(options).toHaveProperty('field', 'user_age');
});
