/**
 * Application
 */
import Koa from 'koa';
import Router from '@koa/router';
import { PluginRouter } from 'koa-plugin-router';
import { ConfigManager } from './config';

export interface ApplicationState {}

/**
 * 应用程序上下文
 */
export type ApplicationContext<StateT = any, CustomT = {}> = Router.RouterContext<
    StateT,
    {
        config: ConfigManager;
    } & CustomT
>;

export class Application extends Koa {
    /**
     * 构造一个Koa应用实例
     */
    constructor(config: ConfigManager) {
        super();

        this._config = config;
    }

    get config() {
        return this._config;
    }

    /**
     * 初始化，在应用启动之前调用，允许用户注册自定义中间件
     */
    async initialize() {}

    /**
     * 请求处理入口
     */
    async entry<StateT = any, CustomT = any>(ctx: ApplicationContext<StateT, CustomT>, next: Koa.Next) {
        try {
            await next();
            // if (ctx.respond !== false) {
            //     ctx.logger.info(`HTTP request: ${ctx.method} ${ctx.origin}, response: ${ctx.status}`, {
            //         res_status: ctx.status,
            //     });
            // }
        } catch (err) {
            // if (ctx.respond !== false) {
            //     // 拦截错误并响应
            //     let status = err.status || err.statusCode || ctx.status || 500,
            //         message = err.message,
            //         context = err.context || {},
            //         errno = 'INTERNAL_SERVER_ERROR';

            //     if (err instanceof Exception) {
            //         message = err.message;
            //         context = err.info() || {};
            //         errno = err.errno || 'UNMARKED_SERVER_ERROR';
            //     }

            //     ctx.logger.error(message, {
            //         // 如果error挂载上下文信息，则记录到日志
            //         context,
            //         stack: (err.stack.call && err.stack()) || err.stack,
            //     });

            //     ctx.status = status;
            //     ctx.body = {
            //         errno,
            //         message,
            //     };
            // }
            console.error(err);
            throw err;
        }
    }

    // createContext<StateT>(req: any, res: any) {
    //     const context = super.createContext<ApplicationContext<StateT>>(req, res);
    //     return context;
    // }

    /**
     * 启动实例
     */
    async start(port: number) {
        await new Promise(resolve => {
            this.listen(port, resolve);
        });
    }

    // private _router: PluginRouter;
    private _config: ConfigManager;
}
