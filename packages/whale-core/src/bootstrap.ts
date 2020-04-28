/**
 * `Bootstrap` decorator for launching koa application
 */
import * as path from 'path';
import * as assert from 'assert';
import Koa from 'koa';
import StaticCache from 'koa-static-cache';
import { PluginRouter } from 'koa-plugin-router';
import { Application, ApplicationContext, ApplicationState } from './application';
import { ConfigManager } from './config';

export interface IApplicationBootstrapOptions {
    base?: string;
    /**
     * 应用程序监听端口号
     */
    port?: number;
    /**
     * 定义模块所在目录，默认为 modules
     */
    modules?: string;
    /**
     * 定义配置所在目录，默认为 config
     */
    config?: string;
    /**
     * 定义静态资源所在目录，默认为 static
     */
    static?: string;
}

export function Bootstrap(options: IApplicationBootstrapOptions): ClassDecorator {
    // decorator
    function decorator(Ctor: any) {
        // 断言装饰器是否正确应用在Koa的派生类上
        assert.ok(
            Ctor.prototype instanceof Application,
            'The `Bootstrap` decorator must act on the Application derived class'
        );

        bootstrap(Ctor, options);
    }

    return decorator;
}

async function bootstrap(Ctor: any, options: IApplicationBootstrapOptions) {
    const base = options.base || process.cwd();
    // 获取应用程序配置
    const config = new ConfigManager(path.join(base, options.config || 'configs'));
    await config.ready;

    // 启动应用程序
    const app: Application = new Ctor(config);
    // 托管静态资源
    if (options.static) {
        const assets = path.join(process.cwd(), options.static);
        app.use(StaticCache(assets, { ...config.get<any>('static', {}) }));
    }
    // 注册日志

    // 注册视图模板工具

    // 用户初始化工作
    await app.initialize();

    app.use(async (ctx, next) => {
        ctx.config = config;
        app.config.get<number>('app.port', 6001);
        await next();
    });

    // 注册业务模块
    let router = new PluginRouter(app, { base });
    await router.register({
        base,
        // middlewares: [app.entry],
        plugins: ['modules/**/handler*.js'], //[`${options.modules || 'modules'}/../handler*.js`],
    });
    router.mount();

    const port = options.port || app.config.get<number>('app.port', 6001)!;
    await app.start(port);
    console.log('The application has already started on ' + port);
}
