// 载入配置文件
var config = require('../../config');



function console_log(msg) {
  config.console_log(msg)
}

function console_err(msg) {
  config.console_err(msg)
}

const ST_P_KEY = 'key_provinceindex';
const ST_JSON_KEY_PREV = 'key_prev_json_';

function setPreSelectProv(provn) {

  try {
    wx.setStorageSync(ST_P_KEY, provn)
  } catch (e) {
    console_err(e)
  }
}

function getPreSelectProv() {
  var st_p_v = wx.getStorageSync(ST_P_KEY);
  if (st_p_v) {
    return st_p_v;
  }
  else {
    return 0;
  }
}

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

var that = null;

function showData(data){
  console_log(data);
  // return;
  that.setData({
    showLoading: false,
    p0: data.oil0,
    p92: data.oil92,
    p95: data.oil95,
    p98: data.oil98
  });
}



function requestGas(provinve_name) {
  console_log("请求开始...");
  wx.request({
    url: "https://api.jisuapi.com/oil/query",
    method: "GET",
    data: {
      appkey: config.showapi_appid,
      province: provinve_name
    },
    complete: function (res) {

      if (res == null || res.data == null) {
        console_log('网络请求失败');
        that.setData({ showloading: false });
        return;
      }
      else {
        var data = res.data.result;

        if(res.data.status==0)
        {
          try {
            wx.setStorageSync(ST_JSON_KEY_PREV+provinve_name, res.data)
          } catch (e) {
            console_err(e)
          }
        }

        showData(data);
        return;
      }
    }
  });
}

function isCurrentDay(day1) {
  var date1 = new Date(day1);

  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  //获取当前时间  
  var n = timestamp * 1000;
  var date2 = new Date(n);  
  console_log("day1 :"+ date1.getFullYear() +" "+date1.getMonth() + " "+date1.getDate() );


  console_log("day2 :" + date2.getFullYear() + " " + date2.getMonth() + " " + date2.getDate());

  if (date1.getFullYear() == date2.getFullYear()
    &&
    date1.getMonth() == date2.getMonth()
    &&
    date1.getDate() == date2.getDate()) {
    return true;
  }

}

function doShowData(prov_name) {


try{
  var res = wx.getStorageSync(ST_JSON_KEY_PREV + prov_name);
  if (res==null) {
    requestGas(prov_name)
    return;
  }
  var time = res.result.updatetime;
  console_log(time)
  if (isCurrentDay(time)) {
    showData(res.result);
  }
  else {
    requestGas(prov_name)
  }
}
catch(e){
  console_err(e);
  requestGas(prov_name)
}

}

//PAGE begin

Page({
  data: { // 参与页面渲染的数据
    provincearray: ['上海', '北京', '江苏', '浙江', '安徽', '天津', '重庆', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'],
    provinceindex: 0,
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
    console_log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      provinceindex: e.detail.value,
      showloading: true
    })

    setPreSelectProv(this.data.provinceindex);

    doShowData(this.data.provincearray[this.data.provinceindex])
  },
  onLoad: function () {

    that = this;
    this.setData({ provinceindex: getPreSelectProv() })



    wx.onNetworkStatusChange(function (res) {
      requestGas(that.data.provincearray[that.data.provinceindex])
    })

    doShowData(that.data.provincearray[that.data.provinceindex])

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console_log(res.target)
    }
    return {
      title: '纯粹油价，不扯虚的',
      path: '/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
