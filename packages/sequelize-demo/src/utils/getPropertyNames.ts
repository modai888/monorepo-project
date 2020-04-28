/**
 * Copyright
 */
import { getOwnPropertyNames } from './getOwnPropertyNames';

/**
 * 获取对象及其原型链上定义的属性
 */
export function getPropertyNames(target: any, excludes?: (prop: string, target: any) => boolean): string[] {
    if (!target || target === Object.prototype) {
        return [];
    }
    return getOwnPropertyNames(target, excludes).concat(getPropertyNames(Object.getPrototypeOf(target), excludes));
}
