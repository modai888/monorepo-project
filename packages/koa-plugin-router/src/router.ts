import 'reflect-metadata';

import path from 'path';
import assert from 'assert';
import { promisify } from 'util';

import * as Koa from 'koa';
import * as glob from 'glob';
import Router from '@koa/router';
import compose from 'koa-compose';
import Debug from 'debug';

import { IPluginOptions, IRouteOptions, IPlugin } from './interfaces';
import { ROUTE_OPTIONS, ROUTE_PLUGIN_OPTIONS } from './decorator';
import { getMethods, getMetadata } from './utils';
import { Handler } from './handler';

const debug = Debug('plugin-router');
const globify = promisify(glob.Glob);
//
// Plugin Default Options
//
const pluginDefaultOptions: PluginRouter.IPluginRouterOptions = {
    base: process.cwd(),
    prefix: '/',
    middlewares: [],
    plugins: ['plugins/**/plugin.js'],
};

/**
 *  Class PluginRouter.
 * */
export class PluginRouter {
    /**
     *  Constructor a new plugin router.
     *
     *  @param app -  a koa application instance.
     *  @param options {object} - plugin router options
     *
     *  options:
     *      - base {String}: the base dir for plugins
     *      - plugins {Array | String}: the plugin entry file, support glob pattern.
     *      - middlewares {Array}: the global koa middleware for all router's request.
     *      - prefix {String}: the prefix for all router.
     *
     * */
    constructor(app: Koa, options: PluginRouter.IPluginRouterOptions) {
        this._app = app;
        this._options = Object.assign({}, pluginDefaultOptions, options || {});
        // base path
        if (this._options.base && !path.isAbsolute(this._options.base)) {
            this._options.base = path.resolve(process.cwd(), this._options.base);
        }

        //  An empty placeholder entry middleware for the plugin.
        // this placeholder middleware will be fill when register plugins.
        // (context: T, next?: () => Promise<any>) => Promise<void>
        this._entry = async (ctx: Router.RouterContext, next?: () => Promise<any>) => {
            next && (await next());
        };
        // 缓存当前已注册路由插件
        this._plugins = [];
    }

    /**
     * 注册新插件
     *
     * @param options
     * */
    async register(options: PluginRouter.IPluginRouterOptions | string) {
        if (typeof options === 'string') {
            options = {
                plugins: [options],
            };
        }

        const opts = Object.assign({}, this._options, options) as PluginRouter.IPluginRouterOptions;

        try {
            // 匹配所有插件并进行注册
            const entries = await this._matchAllPluginEntryFile(opts.plugins || [], opts);

            for (const entry of entries) {
                const result = await this._parsePlugin(entry, opts);
                const { handler, options } = result!;
                this._registerPluginRoute(handler, options, opts);
            }
        } catch (e) {
            console.error('Failed to register plugins: %O', e);
        }
    }

    /**
     *  将路由进行挂载
     * */
    mount() {
        if (!this._mounted) {
            this._compose();
            this._app.use(this._entry);
            this._mounted = true;
        }
    }

    /**
     * 匹配所有插件的入口文件路径
     **/
    private async _matchAllPluginEntryFile(patterns: string[], options: PluginRouter.IPluginRouterOptions) {
        const pluginEntries: string[] = [],
            push = Array.prototype.push;

        for (const pattern of patterns) {
            push.apply(
                pluginEntries,
                await globify(pattern, {
                    cwd: options.base || process.cwd(),
                })
            );
        }

        return pluginEntries;
    }

    /**
     * 加载插件文件并进行验证
     * */
    private async _parsePlugin(entry: string, options: PluginRouter.IPluginRouterOptions) {
        const pluginFile = path.resolve(options.base || process.cwd(), entry);
        let plugin: PluginRouter.Plugin;

        try {
            const module = require(pluginFile);
            plugin = module.default ? module.default : module;
        } catch (e) {
            assert(false, `Failed to load the plugin"${pluginFile}": ${e.message} with stack: ${e.stack}`);
            return;
        }

        // 断言插件必需包含类型为Handler的默认导出
        const isHandler = plugin.prototype instanceof Handler;
        assert(isHandler, `The plugin file(${entry}) must have a default export which must be type of 'Handler'`);

        let pluginOptions: IPluginOptions<any, any> = Reflect.getMetadata(ROUTE_PLUGIN_OPTIONS, plugin);

        // 验证插件对象是否包含指定的属性
        pluginOptions = pluginOptions || {};
        pluginOptions.name = pluginOptions.name || path.dirname(pluginFile).split(path.sep).slice(-1)[0];

        // assert(plugin.routes, 'The plugin object must have an "routes" property.');

        // 插件路由前缀解析
        let prefix = pluginOptions.prefix || options.prefix;
        if (typeof prefix === 'function') {
            prefix = await prefix.call(pluginOptions, this, this._app);
        }

        // 使用文件路径作为前缀
        if (prefix === true) {
            prefix = entry
                .replace(/\/{2,}/g, '/')
                .split('/')
                .slice(1, -1)
                .join('/');
        }

        // normalize prefix
        prefix = (prefix as string).replace(/\\/g, '/');
        // add '/' prefix
        if (prefix && prefix.slice(0, 1) !== '/') {
            prefix = '/' + prefix;
        }
        // remove '/' suffix
        if (prefix && prefix.slice(-1) === '/') {
            prefix = prefix.slice(0, -1);
        }

        pluginOptions.prefix = prefix;

        return { handler: plugin, options: pluginOptions };
    }

    /**
     * 注册插件，为插件生成路由对象
     * */
    private async _registerPluginRoute(
        Handler: IPlugin<Handler>,
        pluginOptions: IPluginOptions<any, any>,
        options: PluginRouter.IPluginRouterOptions
    ) {
        const { prefix = '' } = pluginOptions;

        if (this._hasInstalled(pluginOptions)) {
            console.log(`Plugin "${pluginOptions.name}" has been installed.`);
            return;
        }

        // 生成路由处理器实例，单例模式
        // 后续可考虑对接依赖注入
        const handler: any = new Handler(this, this._app);

        // 解析所有路由方法
        const routes = getMethods(Handler.prototype)
            .map((prop: string) => {
                if (prop === 'constructor') {
                    return null;
                }

                // 获取路由方法上定义的元信息
                const routeOptions: IRouteOptions<any, any> = getMetadata(ROUTE_OPTIONS, Handler, prop);
                if (!routeOptions) return null;

                return {
                    options: routeOptions,
                    handler: handler[prop].bind(handler),
                };
            })
            .filter(_ => !!_);

        // 为插件生成独立路由
        if (!routes.length) return;

        const router = new Router({
            prefix,
        });

        // 注册模块级别的中间件
        if (options.middlewares || pluginOptions.middlewares) {
            const middlewares = ([] as Router.Middleware[]).concat(
                options.middlewares || [],
                pluginOptions.middlewares || []
            );

            if (middlewares.length) {
                router.use(...middlewares);
            }
        }

        for (const route of routes) {
            const { options, handler } = route!;

            const routePath = options.path || '';
            // 注册单个请求方法的路由
            const paths = Array.isArray(routePath) ? routePath : [routePath];
            // 注册路径级别的中间件
            const middlewares = options.middlewares || [];
            if (middlewares.length) {
                router.use(paths, ...middlewares);
            }

            // 支持指定的请求方法
            const methods: string[] = options.methods || [];
            if (!methods.length) {
                methods.push('ALL');
            }
            // // 如果支持GET则同时支持HEAD和OPTIONS
            // if (methods.indexOf('GET') > -1) {
            //     methods.unshift('HEAD', 'OPTIONS');
            // }
            // 去重
            const routeMethods = [...new Set(methods)];

            for (let m of routeMethods) {
                const method = m.toLowerCase();
                debug('Router: %s %s', method, prefix + routePath);
                // console.log('Router: %s %s', method, prefix + routePath);
                // `method-level` middlewares.
                // 注册方法级别的路由中间件
                (router as any)[method].apply(router, [routePath, handler]);
            }
        }

        // plugin.router = router;
        this._plugins.push([pluginOptions, router]);
        if (this._mounted) {
            this._compose();
        }
    }

    private _hasInstalled(plugin: IPluginOptions<any, any>) {
        for (const pluginMap of this._plugins) {
            if (plugin.name === pluginMap[0].name && plugin.version === pluginMap[0].version) {
                return true;
            }
        }

        return false;
    }

    private _compose() {
        const routers = this._plugins.map(p => p[1]);
        this._entry = compose(
            ([] as Router.Middleware[]).concat.apply(
                this._options.middlewares || [],
                routers.map(router => {
                    return [router.routes(), router.allowedMethods()];
                })
            )
        );
    }

    // private
    private _app: Koa;
    private _options: PluginRouter.IPluginRouterOptions;
    private _entry: compose.ComposedMiddleware<Router.RouterContext>;
    private _plugins: [IPluginOptions<any, any>, Router][];
    private _mounted: boolean = false;
}

export namespace PluginRouter {
    export const supportedMethods = ['get', 'head', 'options', 'post', 'delete', 'put', 'patch'];

    /**
     * 路由插件选项
     */
    export interface IPluginRouterOptions {
        /**
         * 基目录，插件解析的依赖目录
         */
        base?: string;
        /**
         * 注册该插件中路由的前缀
         */
        prefix?: string | boolean | ((router: PluginRouter, app: Koa) => Promise<string>);
        /**
         * 所有插件共同的中间件
         */
        middlewares?: Router.Middleware[];
        /**
         * 插件所在路径信息
         */
        plugins?: string[];
    }

    /***
     * 插件对象
     */
    export interface IPlugin {
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
        middlewares?: Router.Middleware[];
        /**
         * 插件路由
         */
        routes: IPluginRouteObject[] | ((router: PluginRouter, app: Koa) => IPluginRouteObject[]);
    }

    export interface IPluginFunction {
        (router: PluginRouter, app: Koa): IPlugin;
    }

    export interface IPluginRouteObject {
        /**
         * 路由path
         */
        path?: string | string[];
        /**
         * 路由共享插件
         */
        middlewares?: Router.Middleware[];
        all?: Router.Middleware | Router.Middleware[];
        get?: Router.Middleware | Router.Middleware[];
        post?: Router.Middleware | Router.Middleware[];
        put?: Router.Middleware | Router.Middleware[];
        head?: Router.Middleware | Router.Middleware[];
        delete?: Router.Middleware | Router.Middleware[];
        options?: Router.Middleware | Router.Middleware[];
        patch?: Router.Middleware | Router.Middleware[];
    }

    export interface Plugin<T = Handler> {
        new (...args: any[]): T;
    }
}
