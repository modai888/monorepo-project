/**
 * Route 装饰器
 *
 *
 */
import 'reflect-metadata';
import { IPluginOptions, IRouteOptions } from './interfaces';

/**
 * 支持的HTTP方法
 */

export const ROUTE_PLUGIN_OPTIONS = Symbol('ROUTE_PLUGIN_OPTIONS');
export const ROUTE_OPTIONS = Symbol('ROUTE_OPTIONS');

/**
 * 路由插件装饰器
 */
export function RoutePlugin<StateT, CustomT = {}>(pluginOpts: IPluginOptions<StateT, CustomT>) {
    return (target: any) => {
        Reflect.defineMetadata(ROUTE_PLUGIN_OPTIONS, pluginOpts, target);
    };
}

/**
 * 路由方法装饰器
 */
export function Route<StateT, CustomT = {}>(opts: IRouteOptions<StateT, CustomT>) {
    return (target: any, propertyKey: string) => {
        // 格式化部分选项
        let { path, methods } = opts;
        path = typeof path === 'string' ? [path] : path;

        opts = { ...opts, path, methods };

        Reflect.defineMetadata(ROUTE_OPTIONS, opts, target, propertyKey);
    };
}
