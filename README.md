# TodayGasInWechat

![](https://github.com/weizongwei5/TodayGasInWechat/raw/master/code.jpg)

数据来自[www.jisuapi.com](http://www.jisuapi.com/)。

## 编译项目
添加config.json到根目录。
```
var config = {
  debug: false,//控制日志输出
  showapi_appid: "",
  console_log: function (msg) {
    if (config.debug) {
      console.log(msg)
    }
  },
  console_err: function (msg) {
    if (config.debug) {
      console.error(msg)
    }
  }
};
module.exports = config;


```

- [ ] TODO：添加订阅油价变化

---------

