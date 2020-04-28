## 从零搭建一个Mono工程

https://zhuanlan.zhihu.com/p/71385053

https://juejin.im/post/5d583231e51d45620541039e

https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/

[微软Starter工程](https://github.com/microsoft?q=starter&type=&language=)


1、在合适的位置创建工程目录`mono-project`

```bash
mkdir mono-project
```


2、全局安装lerna管理工具

```bash
npm install -g lerna
```

3、初始化为多工程项目

```bash
npx lerna init --exact 
```

4、集成Yarn workspaces

```js
// lerna.json

{
    "npmClient": "yarn",
    "userWorkspaces": true
}

// package.json
{
    "workspaces": [
        "packages/*"
    ]
}
```


5、添加子工程

添加子工程可以有两种方式：

1）进入packages目录，创建子工程目录，并初始化

```bash
cd packages && mkdir project-01 && cd project-01 && yarn init -y && cd ../..

```

通过这种方式可以在任意位置创建子工程目录，但需要手动添加包位置到workspaces字段，否则lerna无法识别该子工程

```bash
# 在项目根目录下添加子工程 cas_server

mkdir cas_server && cd cas_server && yarn init -y && cd ..

# 将cas_server添加到package.json的workspaces字段中

{
    "workspaces":[
        "packages/*",
        "cas_server"
    ]
}

```

2）基于lerna的create命令创建子工程

```bash
lerna create project-02 -y
```

通过这种方式创建的package默认会被防止到packages目录下（A custom package location, defaulting to the first configured package location）

6、添加、删除依赖

1）为某个具体的子工程添加、删除依赖

```bash
# 添加依赖
yarn workspace project-01 add lodash

# 删除依赖
yarn workspace project-01 remove lodash

```

2）为所有的包安装、删除依赖

```
# 添加依赖
yarn workspaces run add nanoid

# 删除依赖
yarn workspaces run remove nanoid

```

3）安装内部依赖

```bash
# 将project-01添加为project-02的依赖
lerna add project-01 --scope project-02

```

4）添加开发依赖到root

```bash
yarn add -D -W typescript
```

7、清理环境

```bash
# 清理各子工程的node_modules目录，但不会清理root下的node_modules
lerna clean -y

# 自定义清理，可以在各工程下定义clean脚本，然后通过以下命令统一运行
yarn workspaces run clean

```

8、规范提交

1）添加提交消息校验

```bash
# 安装commitlit 和 husky
yarn add -D -W @commitlint/cli @commitlint/config-conventional husky

```

在根目录增加commitlint配置文件`commitlint.config.js`

```javascript
module.exports = {
    extends: ['@commitlint/config-conventional'] 
}
```

在package.json中配置git hook

```
{
    "husky": {
        "hooks": {
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
        }
    }
}

```

2）添加交互式conventional-commit支持

```bash
# 安装依赖
yarn add -D -W commitizen cz-conventional-changelog cz-lerna-changelog

# 在package.json中配置commitizen
{
    "config": {
        "commitizen": {
            "path": "cz-lerna-changelog"
        }
    }
}

# 添加commit scripts
{
    "scripts": {
        "commit": "git-cz"
    }
}

```

9、添加TS支持

安装typescript 

```bash
yarn -D -W add typescript

## 初始化为ts工程
npx tsc --init
```

10、添加Jest测试（支持TS）

```bash
# 安装依赖包
yarn -W -D add jest ts-jest @types/jest
```

添加jest配置文件jest.config.js

> 每个子工程也需要该配置文件，另外还需要在每个子工程的tsconfig.json中的exclude中排除对*.spec.ts/tsx文件的编译

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```