// pages/allBook/allBook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:0,
    typeList:[
      {type:"全部分类","active":true},
      {type:"玄幻","active":false},
      {type:"都市","active":false},
      {type:"修真","active":false},
      {type:"穿越","active":false},
      {type:"网游","active":false},
      {type:"科幻","active":false},
    ],
    pageSize:7,
    pageNo:1,
    bookList:[],
    hasMore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this

    let {pageNo,pageSize} = that.data
    wx.request({
      url: 'https://www.bjccc.top/novel/getMore',
      data:{
        pageNo,
        pageSize,
      },
      success(res){
        if(res.data.result.length < pageSize || res.data.result.length == 0){
          that.setData({
            tip:false,
            hasMore:false
          })
        }
        that.setData({
          bookList:res.data.result,
          pageNo:pageNo+1
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
    wx.setNavigationBarTitle({
      title: '书库',
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

  bindDownLoad:function(){
    const that = this
    let {bookList,pageNo,pageSize,hasMore} = that.data
    if(hasMore){
      wx.request({
        url: 'https://www.bjccc.top/novel/getMore',
        data:{
          pageNo,
          pageSize
        },
        success(res){
          if(res.data.result.length < pageSize || res.data.result.length == 0){
            that.setData({
              hasMore:false,
            })
          }
          that.setData({
            bookList:bookList.concat(res.data.result),
            pageNo:pageNo+1,
          })
        }
      })
    }
  },
  // 切换类别
  chooseChanel:function(e){
    const that = this
    let index = e.currentTarget.dataset.index
    let {typeList,pageNo,pageSize} = that.data
    // 判断点击的是否是同一个tab 避免重复请求
    let isTab = false
    for(var i in typeList){
      if(typeList[i].active == true){
        if(i == index){
          isTab = true
        }
      }
    }
    // 如果是 则不操作 
    if(isTab){
      return;
    }else{
      // 不是则发起请求
      for(var i in typeList){
        typeList[i].active = false
      }
      typeList[index].active = true
      that.setData({
        typeList,
        bookList:[],
        pageNo:1,
        hasMore:true,
      })

      // 根据点击类型进行请求
      let type = typeList[index].type

      wx.request({
        url: 'https://www.bjccc.top/novel/getMore',
        data:{
          pageNo:1,
          pageSize,
          type,
        },
        success(res){
          if(res.data.result.length < pageSize || res.data.result.length == 0){
            that.setData({
              hasMore:false
            })
          }else{
            that.setData({
              pageNo:pageNo+1
            })
          }
          that.setData({
            bookList:res.data.result
          })
        }
      })
    }
  },

  goDetail:function(e){
    const bookinfo = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/bookDetail/bookDetail?bookinfo=${JSON.stringify(bookinfo)}`,
    })
  }
})