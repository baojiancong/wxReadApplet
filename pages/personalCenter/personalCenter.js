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
    const that = this
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
    if(app.globalData.userInfo){
      that.setData({
        userinfo:app.globalData.userInfo,
        hasLogin:true
      })
    }else{
      that.setData({
        hasLogin:false,
        userinfo:[]
      })
    }
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

  // 用户登录
  userLogin:function(e){
      const that = this
      wx.getUserProfile({
      desc: '用户授权登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        that.setData({
          userinfo: res.userInfo,
          hasLogin: true
        })
        wx.setStorage({
          data: res.userInfo,
          key: 'userinfo',
        })
        app.globalData.userInfo = res.userInfo
        wx.getStorage({
          key: '3rd_sessionId',
          success(res){
            wx.request({
              url: 'https://www.bjccc.top/user/addUser',
              data:{
                openid:res.data,
                nickName:app.globalData.userInfo.nickName,
                city:app.globalData.userInfo.city,
                gender:app.globalData.userInfo.gender,
                avatarUrl:app.globalData.userInfo.avatarUrl
              },
              success(res){
                console.log(res)
              }
            })
          }
        })
      },
      fail(){
          console.log('用户拒绝')
      }
    })
  },

  // 退出登录
  logOut:function(){
    wx.removeStorage({
      key: 'userinfo',
    })
    app.globalData.userInfo = null
    wx.showToast({
      title: '退出登录成功',
    })
    setTimeout(() => {
      this.onShow()
    }, 1500);
  },
})