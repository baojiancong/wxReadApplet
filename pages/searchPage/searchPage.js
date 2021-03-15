// pages/searchPage/searchPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList:[],
    value:'',
    history:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.setNavigationBarTitle({
      title: '搜索',
    })
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
    wx.getStorage({
      key:'history',
      success(res){
        that.setData({
          history:res.data
        })
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

  handleInput:function(e){
    const that = this
    let value = e.detail.value
    wx.request({
      url: 'http://47.102.201.120:8080/findBook',
      data:{
        value
      },
      success(res){
        that.setData({
          bookList:res.data,
          value
        })
      }
    })
  },

  goDetail:function(e){
    const that = this
    const id = e.currentTarget.dataset.id
    let bookinfo = that.data.bookList[id]
    let hasBook = false
    let {history} = that.data
    for(var i in history){
      if(history[i] == bookinfo.novel_name){
        hasBook = true
      }
    }
    if(!hasBook){
      wx.setStorage({
        data: history.concat(bookinfo.novel_name),
        key: 'history',
      })
    }

    wx.navigateTo({
      url: `/pages/bookDetail/bookDetail?bookinfo=${JSON.stringify(bookinfo)}`,
    })
  },

  checkHistory:function(e){
    let value = e.currentTarget.dataset.item
    const that = this
    wx.request({
      url: 'http://47.102.201.120:8080/findBook',
      data:{
        value
      },
      success(res){
        that.setData({
          bookList:res.data,
          value
        })
      }
    })
  },
  clearHistory:function(){
    const that = this
    wx.removeStorage({
      key: 'history',
      success (res) {
        that.setData({
          history:[]
        })
      }
    })
  }
})