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

    wx.getStorage({
      key: 'userinfo',
      success(res){
        if(res.data){
          that.globalData.userInfo = res.data
        }
      }
    })

    wx.checkSession({
      success: (res) => {
        console.log('登录成功')
      },
      fail(){
    // 登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: 'https://www.bjccc.top/function/login',
              data:{
                code:res.code
              },
              success(res){
                wx.setStorage({
                  data: res.data.openid,
                  key: '3rd_sessionId',
                })
              }
            })
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    bookInfo: null,
  },
  addHits:function(id){
    wx.request({
      url: 'https://www.bjccc.top/function/addHits',
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
  },
})
