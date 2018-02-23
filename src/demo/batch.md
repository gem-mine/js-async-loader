---
order: 1
title: 多个脚本文件按顺序异步加载
---

多个脚本文件按顺序异步加载

```jsx
import jsAsyncLoader from "@sdp.nd/js-async-loader";

class App extends React.Component {
  chartsInstance;
  NDChart;
  hchartsLoader = (versions, modules) => {
    versions = versions || "6.0.2";
    modules = modules || ["highcharts", "js/modules/oldie"];
    return modules.reduce((previousValue, currentValue) => {
      return previousValue.then(() =>
        jsAsyncLoader(`//cdn.bootcss.com/highcharts/:versions/:moduleName.js`, "Highcharts", {
          versions,
          moduleName: currentValue
        })
      );
    }, Promise.resolve({}));
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

```css
.react-chart-demo {
  width: 100%;
  height: 500px;
}
```
