// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const that = this
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorage({
      data: 12,
      key: 'fontSize',
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    }),
    wx.getSetting({
      withSubscriptions: true,
      success(res){
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            lang: 'zh_CN',
            success(res){
              that.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    bookInfo: null,
  },
  addHits:function(id){
    wx.request({
      url: 'http://47.102.201.120:8080/addHits',
      data:{
        id:id,
      },
      success(res){
        console.log(res.data)
      }
    })
  },
  textHandle:function(str){
    let newArr = str.split('\n')
    let res = []
    for(var i in newArr){
     newArr[i] =  newArr[i].replace(/\s*/g,"");
         if(newArr[i]!=''){
             res.push(newArr[i])
         }
    }
    return res
  }
})
