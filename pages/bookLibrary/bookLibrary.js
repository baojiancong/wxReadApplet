// pages/bookLibrary/bookLibrary.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carouselList:[],
    recommendList:[],
    rankList:[],
    rankData:true,
    recommendData:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.setNavigationBarTitle({
      title: '首页',
    })
    wx.request({
      url: 'http://47.102.201.120:8080/getRecommend',
      success(res){
          that.setData({
            recommendList : res.data
          })
      },
      fail(){
        that.setData({
          recommendData:false
        })
      }
    });
    wx.request({
      url: 'http://47.102.201.120:8080/getRank',
      success(res){
        let carouselList = []
        for(var i=0;i<3;i++){
          carouselList = carouselList.concat(res.data[i])
        }
        that.setData({
          rankList: res.data,
          carouselList
        })
      },
      fail(){
        that.setData({
          rankData:false
        })
      }
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
    setTimeout(() => {
      this.onLoad();      
    }, 3000);
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
  getMore : function(){
    wx.navigateTo({
      url: '/pages/morePage/morePage',
    })
  },
  goNovelDetail: function(event){
    // const that = this
    const bookinfo = event.currentTarget.dataset.bookinfo
    const bookId = bookinfo.novel_id
    wx.navigateTo({
      // url: `/pages/bookDetail/bookDetail?novel_id=${bookinfo.novel_id}&novel_name=${bookinfo.novel_name}&novel_cover=${bookinfo.novel_cover}&novel_author`,
      url:`/pages/bookDetail/bookDetail?bookinfo=${JSON.stringify(bookinfo)}`
    })
    app.addHits(bookId)
  },
})