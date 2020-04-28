/**
 * `Hello`模块
 */
import Router from '@koa/router';
import { RoutePlugin, Route, Handler } from 'koa-plugin-router';

@RoutePlugin({
    name: 'hello-module',
    version: '1.0.0',
    prefix: '/hello',
    middlewares: [],
})
export default class ApiHandler extends Handler {
    constructor() {
        super();
    }

    /**
     * 获取用户运行的notebook server信息
     * @param ctx
     */
    @Route({
        path: '/world',
        methods: ['GET'],
    })
    async hello(ctx: Router.RouterContext) {
        ctx.body = 'Hello from module';
    }
}
