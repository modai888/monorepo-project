/**
 * Copyright
 */
import { getOwnMethodNames } from './getOwnMethodNames';

/**
 * 获取对象及其原型链上定义的方法
 */
export function getMethodNames(
    target: any,
    excludes: ((prop: string) => boolean) | string[] = ['constructor', 'apply', 'bind', 'call', 'toString']
): string[] {
    if (!target || target === Object.prototype) {
        return [];
    }
    return getOwnMethodNames(target).concat(getMethodNames(Object.getPrototypeOf(target), excludes));
}
