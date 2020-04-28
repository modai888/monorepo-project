## 工程搭建流程说明

[流程说明](doc/create-mono-project.md)

## 项目开发

```bash
## 一间开发启动，包含server和web及变化监听/自动编译等
yarn start:debug

## 单独启动demo_web
yarn workspace demo_web run start:debug

## 单独启动demo_server
yarn workspace demo_server run start:debug

```