# reactmvc [![NPM version](https://img.shields.io/npm/v/reactmvc.svg?style=flat)](https://npmjs.org/package/reactmvc)
M(immutable model)V(react component)C(react-router)
> 一个用于 React app 的 MVC 解决方案

## 安装

```bash
$ npm i reactmvc --save
```

## 介绍

### Traditional MVC
![traditional_mvc](http://img2.tbcdn.cn/L1/461/1/fb27850da370811b578e493af6ac7994f77ebf8d)

### MVC in frontend
![mvc_in_frontend](http://img4.tbcdn.cn/L1/461/1/ad798c5eac2e2a97e54e14db94414a3113454433)

### Model, Controller, View
1. Model: 分为 dataModel 和 uiModel，基于 Immutable-js。dataModel 实现服务端数据接口的抽象，提供存取、缓存、清空接口；uiModel 是本地 UI 数据的抽象。提供本地 UI 数据的存取操作。基于 Immutable-js 保证 model 的安全。
2. Controller: React-router，根据 router 获取需要渲染的组件，并且从 Model 中提取组件需要的数据（服务端数据和本地 UI 数据），然后返回需要渲染的组件以及需要的 props 数据。
3. View: React Component(stateless component)

### 目标
1. 分离服务端数据和本地 UI 数据。对服务端数据接口进行抽象才能真正实现服务端数据共享，而且可以让我们更专注于 UI。props = uiModel + dataModel.filter(uiModel)。
2. action 回归到本质：uiModel get/set, dataModel call/remove，数据获取更新只发生在渲染前。
3. 数据更新只需要清空对应数据缓存（dataModel.remove）。
4. 数据获取完全由 react-router 来管理，组件不需要关心数据获取，只需要关注描述渲染（stateless comonent）。

### 实现
1. async-props：配合 React-router 实现异步渲染，先异步获取组件所需数据，然后再渲染组件。
2. Model, HttpModel: 提供 dataModel 和 uiModel 的抽象类
3. wrapper: router component 的高阶组件，将组件渲染所需数据和 action 绑定到组件 props 上
