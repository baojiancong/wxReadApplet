// pages/personalCenter/personalCenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:[],
    hasLogin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
    const that = this
    // 查看用户是否授权登陆
    wx.getSetting({
      success(res){
        console.log(res)
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            lang: 'zh_CN',
            success(res){
              that.setData({
                userinfo:res.userInfo,
                hasLogin:true
              })
            }
          })
        }else{
          that.setData({
            hasLogin:false,
            userinfo:[]
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindgetuserinfo:function(res){
    const that = this
    // 如果接受授权
    if(res.detail.userInfo){
      app.globalData.userInfo = res.detail.userInfo
      if(app.globalData.bookInfo){
        const bookinfo = app.globalData.bookInfo.bookinfo
        wx.showToast({
          title: '授权登录成功',
        })
        setTimeout(()=>{
          wx.navigateTo({
            url: `/pages/bookDetail/bookDetail?bookinfo=${bookinfo}`,
          },()=>{
            that.setData({
              hasLogin:true,
            })
          })
          app.globalData.bookInfo = null
        },1500)
      }else{
        wx.showToast({
          title: '授权登录成功',
        })
        setTimeout(()=>{
          that.setData({
            hasLogin:true
          })
          wx.setNavigationBarTitle({
            title: '个人中心',
          })
          wx.getUserInfo({
            lang: 'zh_CN',
            success(res){
              that.setData({
                userinfo:res.userInfo
              })
              wx.request({
                url: 'http://47.102.201.120:8080/addUserInfo',
                data:{
                  nickName:res.userInfo.nickName,
                  gender:res.userInfo.gender,
                  city:res.userInfo.city,
                  avatarUrl:res.userInfo.avatarUrl
                },
                success(res){
                  console.log(res.data)
                }
              })
            }
          }) 
        },1500)
      }
    }
  },

  // 清除缓存
  clear:function(){
    wx.showModal({
      title:'注意',
      content:'你确定清空缓存吗?',
      showCancel:false,
      confirmText:'确定',
      success:function(res){
      if (res.confirm){
        wx.clearStorage({
          success: (res) => {
            wx.showToast({
              title: '缓存清除成功',
              icon:'none'
            })
          },
        })
      }}
    })
  },
  // 退出登录
  logOut:function(){
    wx.openSetting({
      withSubscriptions: true,
    })
  }
})