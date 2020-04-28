/**
 * Test for `getOwnPropertyNames`
 */
import { getOwnPropertyNames } from './getOwnPropertyNames';

test('target is null', () => {
    expect(getOwnPropertyNames(null)).toHaveLength(0);
});

test('target is undefined', () => {
    expect(getOwnPropertyNames(undefined)).toHaveLength(0);
});

test('target is boolean', () => {
    expect(getOwnPropertyNames(false)).toHaveLength(0);
    expect(getOwnPropertyNames(true)).toHaveLength(0);
});

test('target is number', () => {
    expect(getOwnPropertyNames(1)).toHaveLength(0);
});

test('target is empty string', () => {
    expect(getOwnPropertyNames('', (prop: string) => ['length'].indexOf(prop) > -1)).toHaveLength(0);
});

test('target is non-empty string', () => {
    expect(getOwnPropertyNames('hello')).toEqual(['0', '1', '2', '3', '4', 'length']);
});

test('target is class', () => {
    class A {
        private name!: string;
        constructor() {
            this.name = 'aaa';
        }
    }

    expect(getOwnPropertyNames(new A())).toHaveLength(1);
    expect(getOwnPropertyNames(new A())).toEqual(['name']);
});
