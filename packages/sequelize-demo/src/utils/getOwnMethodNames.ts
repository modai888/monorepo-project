/**
 * Copyright
 */
import { isFunction } from './isFunction';
import { getOwnPropertyNames } from './getOwnPropertyNames';

/**
 * 获取对象上定义的方法
 */
export function getOwnMethodNames(
    target: any,
    excludes: ((prop: string) => boolean) | string[] = ['constructor', 'apply', 'bind', 'call', 'toString']
) {
    if (!isFunction(excludes)) {
        excludes = (prop: string) => (excludes as Array<string>).indexOf(prop) > -1;
    }

    return getOwnPropertyNames(target, (prop, target) => {
        return !isFunction(target[prop]) || (excludes as Function)(prop);
    });
}
