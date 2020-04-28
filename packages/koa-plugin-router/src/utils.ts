/**
 * 获取对象及其原型链上的方法
 */
import { Class } from './interfaces';

export function getMethods(obj: object | null): string[] {
    if (obj === Object.prototype) {
        return [];
    }
    return Object.getOwnPropertyNames(obj).concat(getMethods(Object.getPrototypeOf(obj)));
}

/**
 * 获取metadata
 * @param metadataKey
 * @param target
 * @param propertyKey
 */
export function getMetadata(metadataKey: string | Symbol, target: Class, propertyKey?: string) {
    if (propertyKey === undefined) {
        return Reflect.getMetadata(metadataKey, target);
    }
    return Reflect.getMetadata(metadataKey, target.prototype, propertyKey);
}
