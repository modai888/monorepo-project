/**
 * Copyright
 */

/**
 * 获取对象上定义的属性
 * @param target
 * @param excludes
 */
export function getOwnPropertyNames(
    target: any,
    excludes: (prop: string, target: any) => boolean = (prop: string) => false
) {
    if (target == null) {
        return [];
    }

    return Object.getOwnPropertyNames(target).filter((prop: string) => {
        return !excludes(prop, target);
    });
}
