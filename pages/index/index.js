// 载入配置文件
var config = require('../../config');

function formatterDateTime() {
  var date = new Date()
  var month = date.getMonth() + 1
  var datetime = date.getFullYear()
    + ""// "年"
    + (month >= 10 ? month : "0" + month)
    + ""// "月"
    + (date.getDate() < 10 ? "0" + date.getDate() : date
      .getDate())
    + ""
    + (date.getHours() < 10 ? "0" + date.getHours() : date
      .getHours())
    + ""
    + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
      .getMinutes())
    + ""
    + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
      .getSeconds());
  return datetime;
}

var that=null;

function requestGas(provinve_name){

  wx.request({
    url: "https://route.showapi.com/138-46",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    data: {
      showapi_appid: config.showapi_appid,
      showapi_sign: config.showapi_sign,
      showapi_timestamp: formatterDateTime(),
      prov: provinve_name
    },
    complete: function (res) {

      if (res == null || res.data == null) {
        console.log('网络请求失败');
        that.setData({ showloading: false });
        return;
      }
      else {
        var data = res.data.showapi_res_body.list[0]
        console.log(data);
        that.setData({
          showLoading: false,
          p0: data.p0,
          p89: data.p89,
          p90: data.p90,
          p92: data.p92,
          p93: data.p93,
          p95: data.p95,
          p97: data.p97
        });
        return;
      }
    }
  });
}


//data begin

Page({
  data: { // 参与页面渲染的数据
    provincearray: ['上海', '北京', '江苏', '浙江', '安徽','天津', '重庆','香港','澳门','河北','山西','内蒙','辽宁','吉林','黑龙江','福建','江西','山东','河南','湖北','湖南','广东','广西','海南','四川','贵州','云南','西藏','陕西','甘肃','青海','宁夏','新疆'],
    provinceindex:0,
    showLoading: true,
    p95: null,
    p92: null,
    p0: null,
    p89: null,
    p90: null,
    p93: null,
    p97: null,
    lasttime: null
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      provinceindex: e.detail.value,
      showloading:true
    })
    requestGas(that.data.provincearray[that.data.provinceindex])
  },
  onLoad: function () {

    that = this;

    requestGas(that.data.provincearray[that.data.provinceindex])

  }
})
