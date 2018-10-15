# 脚本异步加载组件

---

脚本文件异步加载

## 何时使用

- 需要异步加载 js 库时。

## 浏览器支持

IE 8+

## 安装

```bash
npm install @sdp.nd/js-async-loader --save
```

## 运行

```bash
# 默认开启服务器，地址为 ：http://local:8000/

# 能在ie9+下浏览本站，修改代码后自动重新构建，且能在ie10+运行热更新，页面会自动刷新
npm run start

# 构建生产环境静态文件，用于发布文档
npm run site
```

## 代码演示

```css
.react-map-demo {
  width: 100%;
  height: 500px;
}
.react-chart-demo {
  width: 100%;
  height: 500px;
}
```

### 加载单个带回调的脚本

加载单个带回调的脚本

```jsx
import jsAsyncLoader from "@sdp.nd/js-async-loader";

class App extends React.Component {
  mapInstance;
  NDMap;
  gMapLoader = sdkUrlParams => {
    sdkUrlParams.region = sdkUrlParams.region || "CN";
    const url = sdkUrlParams.region.toLowerCase() === "cn" ? "//maps.google.cn" : "//maps.googleapis.com";
    return jsAsyncLoader(url + "/maps/api/js", "google.maps", sdkUrlParams, "callback");
  };
  componentDidMount() {
    this.gMapLoader({ key: "AIzaSyApHj2_Tdn4ryecpuEejrrpnU6IQZFqmx4" }).then(objBMap => {
      this.NDMap = objBMap;
      this.mapInstance = new objBMap.Map(this.container, {
        center: { lng: 116.404, lat: 39.915 },
        zoom: 11,
        minZoom: 1,
        maxZoom: 17
      });
      this.forceUpdate();
    });
  }
  bindContainer = container => {
    this.container = container;
  };
  render() {
    return <div ref={this.bindContainer} className="react-map-demo" />;
  }
}
ReactDOM.render(<App />, mountNode);
```

### 多个脚本文件按顺序异步加载

多个脚本文件按顺序异步加载

```jsx
import jsAsyncLoader from "@sdp.nd/js-async-loader";

class App extends React.Component {
  chartsInstance;
  NDChart;
  hchartsLoader = async (versions, modules) => {
    const uri = `//cdn.bootcss.com/highcharts/:versions/:moduleName.js`;
    versions = versions || "6.0.2";
    await jsAsyncLoader(uri, "Highcharts", {
      versions,
      moduleName: "highcharts"
    });
    await jsAsyncLoader(uri, null, {
      versions,
      moduleName: "js/modules/oldie"
    });
    return Highcharts;
  };
  componentDidMount() {
    const chartOptions = {
      chart: {
        type: "bar" //指定图表的类型，默认是折线图（line）
      },
      title: {
        text: "Highcharts 入门示例" // 标题
      },
      xAxis: {
        categories: ["苹果", "香蕉", "橙子"] // x 轴分类
      },
      yAxis: {
        title: {
          text: "吃水果个数" // y 轴标题
        }
      },
      series: [
        {
          // 数据列
          name: "小明", // 数据列名
          data: [1, 0, 4] // 数据
        },
        {
          name: "小红",
          data: [5, 7, 3]
        }
      ]
    };
    this.hchartsLoader().then(objHighcharts => {
      this.NDChart = objHighcharts;
      this.chartsInstance = new objHighcharts.chart(this.container, chartOptions);
      this.forceUpdate();
    });
  }
  bindContainer = container => {
    this.container = container;
  };
  render() {
    return <div ref={this.bindContainer} className="react-chart-demo" />;
  }
}
ReactDOM.render(<App />, mountNode);
```

### 需要异步加载样式的场景

需要异步加载样式的场景

```jsx
import jsAsyncLoader from "@sdp.nd/js-async-loader";
import cssLoader from "fg-loadcss";

async function loadDepend() {
  await jsAsyncLoader("//cdncs.101.com/v0.1/static/fish/script/react/0.14.9/react.js", "React");
  await jsAsyncLoader("//cdncs.101.com/v0.1/static/fish/script/react-dom/0.14.9/react-dom.js", "ReactDOM");
  cssLoader.loadCSS("//cdncs.101.com/v0.1/static/fish/2.10.3/fish.min-1.css");
  cssLoader.loadCSS("//cdncs.101.com/v0.1/static/fish/2.10.3/fish.min-2.css");
  return await jsAsyncLoader("//cdncs.101.com/v0.1/static/fish/2.10.3/fish.min.js", "fish");
}
class App extends React.Component {
  state = { loaded: false };
  componentDidMount() {
    loadDepend().then(() => {
      this.setState({ loaded: true, Button: fish.Button });
    });
  }
  render() {
    const { loaded, Button } = this.state;
    if (loaded) {
      return (
        <div>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="ghost">Ghost</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="warn">Warn</Button>
          <Button type="font">Font</Button>
        </div>
      );
    } else {
      return null;
    }
  }
}

ReactDOM.render(<App />, mountNode);
```

## API

```js
import jsAsyncLoader from "@sdp.nd/js-async-loader";
const sdkUrl = `//api.map.baidu.com/api`;
const detectionName = "BMap";
const sdkUrlParams = { v: "3.0", ak: "zIT2dNIgEojIIYjD91wIbiespAnwM0Zu" };
const callbackName = "callback";
jsAsyncLoader(sdkUrl, detectionName, sdkUrlParams, callbackName);
```

| 参数          | 说明                                     | 类型   | 默认值 | 是否必填 |
| ------------- | ---------------------------------------- | ------ | ------ | -------- |
| sdkUrl        | 需异步加载的不带参数的 jsSDK 的 url      | string | -      | 是       |
| detectionName | jsSDK 加载后挂在 window 下的变量名称     | string | -      | 否       |
| sdkUrlParams  | jsSDK 的 url 参数                        | Object | {}     | 否       |
| callbackName  | jsSDK 的一个参数名称，用于传递回调方法名 | string | -      | 否       |
