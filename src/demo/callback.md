---
order: 0
title: 加载单个带回调的脚本
---

加载单个带回调的脚本

```jsx
import jsAsyncLoader from "@sdp.nd/js-async-loader";

class App extends React.Component {
  mapInstance;
  NDMap;
  baiduMapLoader = sdkUrlParams => {
    sdkUrlParams.region = sdkUrlParams.region || "CN";
    const url = sdkUrlParams.region.toLowerCase() === "cn" ? "//maps.google.cn" : "//maps.googleapis.com";
    return jsAsyncLoader(url + "/maps/api/js", "google.maps", sdkUrlParams, "callback", true);
  };
  componentDidMount() {
    this.baiduMapLoader({ key: "AIzaSyApHj2_Tdn4ryecpuEejrrpnU6IQZFqmx4" }).then(objBMap => {
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

```css
.react-map-demo {
  width: 100%;
  height: 500px;
}
```
