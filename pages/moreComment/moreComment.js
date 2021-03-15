// pages/moreComment/moreComment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId:'',
    pageNo:2,
    pageSize:5,
    commentInfo:[],
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.setNavigationBarTitle({
      title: '全部评论',
    })
    that.setData({
      bookId:options.bookId
    })
    wx.request({
      url: 'http://47.102.201.120:8080/getCommentMore',
      data:{
        pageNo:1,
        pageSize:that.data.pageSize,
        bookId:options.bookId
      },
      success(res){
        if(res.data.length > 0){
          for(var i in res.data){
            res.data[i].comment_time = that.rTime(res.data[i].comment_time)
          }
          that.setData({
            commentInfo:res.data
          })
        }
        that.setData({
          commentInfo:res.data
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
    console.log(maxHeight)
    setTimeout(() => {
      let query = wx.createSelectorQuery();
      query.select('.comment-box').boundingClientRect(rect=>{
        curHeight = rect.height;
        console.log(curHeight)
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
 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this
    if(that.data.hasMore){
      wx.request({
        url: 'http://47.102.201.120:8080/getCommentMore',
        data:{
          pageNo:that.data.pageNo,
          pageSize:that.data.pageSize,
          bookId:that.data.bookId
        },
        success(res){
          if(res.data.length > 0 && res.data.length == 5){
            for(var i in res.data){
              res.data[i].comment_time = that.rTime(res.data[i].comment_time)
            }
            that.setData({
              commentInfo:that.data.commentInfo.concat(res.data),
              pageNo:that.data.pageNo + 1
            })
          }else{
            for(var i in res.data){
              res.data[i].comment_time = that.rTime(res.data[i].comment_time)
            }
            that.setData({
              commentInfo:that.data.commentInfo.concat(res.data),
              hasMore:false
            })
          }
        }
      })
  }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
    //转换时间格式
    rTime:function(date){
      var json_date = new Date(date).toJSON();
      return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
    },
})