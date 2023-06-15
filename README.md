<center>

# @wsvaio/uniapi

[![Size](https://img.shields.io/bundlephobia/minzip/@wsvaio/uniapi/latest)](https://www.npmjs.com/package/@wsvaio/uniapi) [![Version](https://img.shields.io/npm/v/@wsvaio/uniapi)](https://www.npmjs.com/package/@wsvaio/uniapi) [![Languages](https://img.shields.io/github/languages/top/wsvaio/uniapi)](https://www.npmjs.com/package/@wsvaio/uniapi) [![License](https://img.shields.io/npm/l/@wsvaio/uniapi)](https://www.npmjs.com/package/@wsvaio/uniapi) [![Star](https://img.shields.io/github/stars/wsvaio/uniapi)](https://github.com/wsvaio/uniapi) [![Download](https://img.shields.io/npm/dm/@wsvaio/uniapi)](https://www.npmjs.com/package/@wsvaio/uniapi)

</center>

> [@wsvaio/api](https://www.npmjs.com/package/@wsvaio/api) uniapp 版本，核心请求由 fetch 更换为 uni.request


一个使用 TypeScript 编写的 UniApp 网络请求库，主要用于处理 HTTP 请求。库提供了一系列功能，包括创建 API、设置全局上下文、执行请求等。通过合并上下文和配置，您可以轻松地定制网络请求的行为。此外，库还提供了一些实用的中间件，用于处理请求和响应。例如，您可以在请求之前拼接 URL、检查返回结果等。同时，库还支持日志输出，方便调试和查看请求情况。总之，这是一个功能丰富、易于使用的网络请求库，可以帮助您快速地处理各种网络请求。

## 安装

`npm install --save @wsvaio/uniapi`

## 使用方法

首先，需要引入请求库：

`import { createAPI } from '@wsvaio/uniapi';`

接下来，可以创建一个 API 实例：

``` javascript
const api = createAPI({
  baseURL: 'https://api.example.com',
  // 其他配置选项
});
```

现在，可以使用  api  实例发起请求：

``` javascript
// GET 请求
api.get({ url: '/users' }).then((data) => {
  console.log(data);
});

// POST 请求
api.post({
	url: '/users',
  body: {
    name: '张三',
    age: 30,
  },
}).then((data) => {
  console.log(data);
});

// PUT 请求
api.put({
	url: '/users/1',
  body: {
    name: '李四',
    age: 28,
  },
}).then((data) => {
  console.log(data);
});

// DELETE 请求
api.del({ url: '/users/1' }).then((data) => {
  console.log(data);
});

// query & param & body
// 简写
get({ q: {}, p: {}, b: {} });
// 全写，优先级高，并且body支持更多类型
get({ query: {}, param: {}, body: {} });
```

## 中间件

本请求库支持使用中间件来扩展功能。以下是一些示例：

### 请求前中间件
``` javascript
api.use('before')((ctx, next) => {
  console.log('请求前');
  return next();
});
```
### 请求后中间件
``` javascript
api.use('after')((ctx, next) => {
  console.log('请求后');
  return next();
});
```
### 错误处理中间件
``` javascript
api.use('error')((ctx, next) => {
  console.log('错误处理');
  return next();
});
```
### 最终处理中间件
``` javascript
api.use('final')((ctx, next) => {
  console.log('最终处理');
  return next();
});
```


## Typescirpt

```typescript
// 泛型支持
type Params = { filed1: string };
type Result = { code: number; data: any; msg: string };
const result = await get<Params, Result>({ b: {}, q: {}, p: {} });
// Params 可以为body query param提供类型提示
// Result 可以设置result的类型
```


## 柯里化配置

只要传入 config = true，请求就不会调用，可继续柯里化配置
配置项可以是一个字符串，该字符串会被赋值给 ctx.url，并且将 ctx.config 视为 true
配置隔离，不会发生污染

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { get } = createAPI();
// 柯里化配置
const getTest1 = get({ url: "/test", config: true });
const getTest2 = getTest2({ q: { p1: 1 }, config: true });
const getTest3 = get("/test");
// 发送请求
getTest1({ q: { p1: 1 } });
getTest2({ q: { p2: 2 } });
getTest3();
// or
get({ q: {}, config: true })({ p: {}, config: true })({ b: {}, config: true })();
// or
get("/test/:id")({ p: { id: 1 } }); // get /test/1
```

## 派生配置

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { extendAPI } = createAPI({
  baseURL: "/api",
});

// 派生配置，继承父级的配置
const { get } = extendAPI();

// 发送请求
get({ url: "/test" });
```

## 日志打印

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { get } = createAPI({
  log: true, // 日志打印
});
```

## 超时中断请求

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { get } = createAPI({
  timeout: 5000, // 超时中断请求
});
```

## API

[document……](https://wsvaio.github.io/uniapi/modules.html)

## 源码

源码可以在 [GitHub 仓库](https://github.com/wsvaio/uniapi) 中找到。

## 贡献

如果您发现@wsvaio/uniapi中有任何问题或缺少某些功能，请随时提交问题或请求。

我们欢迎您的贡献，包括提交错误修复、添加新功能或改进文档。
