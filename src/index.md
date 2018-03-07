---
category: Components
subtitle: 异步加载脚本
type: Other
title: jsAsyncLoader
---

脚本文件异步加载

## 何时使用

* 需要异步加载js库时。

## API

```jsx
import jsAsyncLoader from "@sdp.nd/js-async-loader";
const sdkUrl = `//api.map.baidu.com/api`;
const detectionName = "BMap";
const sdkUrlParams = { v: "3.0", ak: "zIT2dNIgEojIIYjD91wIbiespAnwM0Zu" };
const callbackName = "callback";
const detectionNameExist = true;
scriptjsLoader(sdkUrl, detectionName, sdkUrlParams, callbackName, detectionNameExist);
```

| 参数               | 说明                                                               | 类型    | 默认值 |
| ------------------ | ------------------------------------------------------------------ | ------- | ------ |
| sdkUrl             | 需异步加载的不带参数的 jsSDK 的 url                                | string  | -      |
| detectionName      | jsSDK 加载后挂在 window 下的变量名称                               | string  | -      |
| sdkUrlParams       | jsSDK 的 url 参数                                                  | Object  | {}     |
| callbackName       | jsSDK 的一个参数名称，用于传递回调方法名                           | string  | -      |
| detectionNameExist | 是否开启 jsSDK 变量已经存在的检测。为 true 会检测，防止重复加载 js | boolean | false  |
