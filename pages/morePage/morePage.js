// pages/morePage/morePage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo:2, //当前页标
    pageSize:5, //每页条数
    hasMore:true,
    bookList:[],
    request:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.request({
      url: 'https://www.bjccc.top/novel/getRank',
      success(res){
        that.setData({
          bookList:res.data.result
        })
      },
      fail(){
        that.setData({
          request:false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const maxHeight = wx.getSystemInfoSync().windowHeight
    var curHeight = "";
    setTimeout(() => {
      let query = wx.createSelectorQuery();
      query.select('.book-list').boundingClientRect(rect=>{
        curHeight = rect.height;
      }).exec();
    }, 100);
    if(curHeight<maxHeight){
      this.onReachBottom()
    }
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
    wx.startPullDownRefresh()
    setTimeout(()=>{
      wx.stopPullDownRefresh()
    },2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this
    wx.request({
      url: 'https://www.bjccc.top/novel/getMore',
      data:{
        pageNo:that.data.pageNo,
        pageSize:that.data.pageSize
      },
      success(res){
        if(that.data.hasMore){
          if(res.data.result.length != 0){
            that.setData({
            // that.data.bookList.concat(res.data.result)
              bookList:[...that.data.bookList,...res.data.result],
              pageNo: that.data.pageNo+1
            })
          }else{
            that.setData({
              hasMore:false
            })
          }
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
  }
})