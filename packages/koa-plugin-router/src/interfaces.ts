import * as Router from '@koa/router';

// 类型声明
export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type Class<T = any> = new (...args: any[]) => T;

export type Plugin<T> = new (...args: any[]) => T;

/**
 * 插件类型
 */
export interface IPlugin<T = any> {
    new (...args: any[]): T;
}

/***
 * 插件对象
 */
export interface IPluginOptions<StateT, CustomT> {
    /**
     * 插件名字
     */
    name: string;
    /**
     * 插件版本号
     */
    version: string;
    /**
     * 插件路由前缀
     */
    prefix?: string;
    /**
     * 插件共同的中间件
     */
    middlewares?: Router.Middleware<StateT, CustomT>[];
}

/**
 * 路由定义对象
 */
export interface IRouteOptions<StateT, CustomT> {
    path: string | string[];
    methods?: HttpMethod[];
    middlewares?: Router.Middleware<StateT, CustomT>[];
}
