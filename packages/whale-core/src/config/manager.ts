/**
 * 配置管理器
 */
import path from 'path';
import walk from 'klaw-sync';
import merge from 'deepmerge';

// 当前支持的运行环境
const ENVS = ['development', 'testing', 'staging', 'production'];

export class ConfigManager {
    constructor(configDir: string) {
        // 遍历配置目录
        this._configDir = path.resolve(configDir);
        this._ready = this.load();
    }

    get ready() {
        return this._ready;
    }

    /**
     * 获取指定的配置项
     */
    get<T>(key: string, defaultValue?: T) {
        let val = this._get<T>(this._configs, key);
        return val === undefined ? defaultValue : val;
    }

    private _get<T>(object: any, property: string | string[]): T | undefined {
        let props = Array.isArray(property) ? property : property.split('.'),
            name = props[0],
            value = object[name];

        if (props.length <= 1) {
            return value;
        }
        // Note that typeof null === 'object'
        if (value === null || typeof value !== 'object') {
            return undefined;
        }
        return this._get<T>(value, props.slice(1));
    }

    /**
     * 加载配置
     */
    private async load() {
        const items = walk(this._configDir, {
            filter: ({ path: file }) => path.extname(file) === '.js',
        });

        for (let i = 0; i < items.length; i++) {
            try {
                let module = require(items[i].path);
                let config = module.default ? module.default : module;
                if (typeof config === 'function') {
                    config = await Promise.resolve(config());
                }

                if (!config || Object.prototype.toString.call(config) !== '[object Object]') {
                    throw new Error(
                        'Config file must export an object or a function that return an object by default.'
                    );
                }
                // 基于运行环境合并配置项
                const defaultItems = ENVS.reduce(
                    (items, env) => {
                        delete items[env];
                        return items;
                    },
                    { ...config }
                );

                let prop = path.basename(items[i].path, path.extname(items[i].path));
                this._configs[prop] = merge(defaultItems, process.env.NODE_ENV ? config[process.env.NODE_ENV] : {});
            } catch (error) {
                error = new Error(`Failed to load config from file "${items[i].path}": ${error}`);
                throw error;
            }
        }
    }

    private _configs: any = {};
    private _configDir: string;
    private _ready: Promise<void>;
}
