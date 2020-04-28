// config for webpack
const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const baseUrl = '/';
const productionGzipExtensions = ['js', 'css'];

module.exports = {
    assetsDir: 'assets',

    pages: {
        index: {
            entry: 'src/main.ts',
            // title: 'DataFountain Science Lab',
        },

        // page: {
        //     entry: 'src/entry.ts',
        //     title: 'page',
        //     filename: 'page-tpl.html',
        // },
    },

    filenameHashing: !process.env.WATCH,
    productionSourceMap: process.argv.indexOf('--no-sourcemap') < 0, //process.env.NODE_ENV !== 'production',

    css: {
        loaderOptions: {
            // 给less loader传递参数
            less: {
                javascriptEnabled: true,
            },
        },
    },

    configureWebpack: config => {
        console.log(process.argv);
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.plugins.push(
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 1024,
                    minRatio: 0.8,
                })
            );
        } else {
            // 为开发环境修改配置...
        }
    },

    chainWebpack: config => {
        // GraphQL Loader
        config.module
            .rule('ico')
            .test(/\.ico$/)
            .use('file-loader')
            .loader('file-loader')
            .tap(args => {
                console.warn('url-loader', args)
                return args
            })
    },

    devServer: {
        port: 8082,
        host: 'portal-local.lunjian.team',

        // 该选项需要查看vue-cli是如何配置的
        historyApiFallback: {
            disableDotRule: true,
            rewrites: [
                {
                    from: /^\/notebooks\/print$/,
                    to: path.posix.join(baseUrl, 'print-tpl.html'),
                },
                {
                    from: /^\/notebooks\/preview$/,
                    to: path.posix.join(baseUrl, 'preview-tpl.html'),
                },
                { from: /./, to: path.posix.join(baseUrl, 'index.html') },
            ],
        },
        logLevel: 'debug',

        proxy: {
            '^/notebooks/api': {
                target: 'http://test-lab.datafountain.cn:2444',
                changeOrigin: true,
                headers: {},
                logLevel: 'debug',
            },
            '^/notebooks/labs/service-proxy': {
                target: 'http://test-lab.datafountain.cn:2444',
                changeOrigin: true,
                headers: {},
                logLevel: 'debug',
            },
            '^/notebooks/[^\/]+/service-proxy': {
                target: 'http://test-lab.datafountain.cn:2444',
                changeOrigin: true,
                headers: {},
                logLevel: 'debug',
            },
            '^/hub/api': {
                target: 'http://test-lab.datafountain.cn:2444',
                changeOrigin: true,
                headers: {},
                logLevel: 'debug',
            },
            '^/user/[^/]+/api/kernels/[^/]+/channels': {
                target: 'https://dlab-demo.datafountain.cn',
                changeOrigin: true,
                headers: {
                    Origin: 'https://dlab-demo.datafountain.cn',
                },
                ws: true,
            },
            '^/user': {
                target: 'http://test-lab.datafountain.cn:2444',
                changeOrigin: true,
                headers: {},
                logLevel: 'debug',
            },
            '/upload': {
                target: 'http://test-lab.datafountain.cn:2444',
                changeOrigin: true,
                headers: {},

                logLevel: 'debug',
            },
        },

        // 解决本地域名映射访问时：Invalid Host Header
        // 或者 disableHostCheck: true
    },
};
