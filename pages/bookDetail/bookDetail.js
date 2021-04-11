// pages/bookDetail/bookDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasBook:false,
    stars:0,
    showSwitch:false,
    txtHidden:true,
    bookinfo:[],
    chapterinfo:[],
    commentinfo:[{

    }],
    hots:0,
    commentCount:0,
    showPop:false,
    stars:[
      {
        flag:1,
        bgImg: "/pages/images/star.png",
        bgfImg:"/pages/images/dark-star.png",
        tip:"太差了"
      },
      {
        flag:1,
        bgImg: "/pages/images/star.png",
        bgfImg:"/pages/images/dark-star.png",
        tip:"不太好"
      },
      {
        flag:1,
        bgImg: "/pages/images/star.png",
        bgfImg:"/pages/images/dark-star.png",
        tip:"一般般"
      },
      {
        flag:1,
        bgImg: "/pages/images/star.png",
        bgfImg:"/pages/images/dark-star.png",
        tip:"还不错"
      },
      {
        flag:1,
        bgImg: "/pages/images/star.png",
        bgfImg:"/pages/images/dark-star.png",
        tip:"超精彩"
      }
    ],
    starScore:'',
    userComment:'',
    userInfo:[],
    hasLogin:false,
    wishCount:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const bookinfo = JSON.parse(that.options.bookinfo)
    that.setData({
      bookinfo,
    })
    // 获得评论展示数据
    wx.request({
      url: 'https://www.bjccc.top/comment/getCommentPart',
      data:{
        id:bookinfo.novel_id
      },
      success(res){
        if(res.data.code == 'success'){
          if(res.data.result.length > 0){
            for(var i in res.data.result){
              res.data.result[i].comment_time = that.rTime(res.data.result[i].comment_time)
            }
          }
          that.setData({
            commentinfo:res.data.result,
          })
        }
      }
    })
    // 获得收藏数量
    wx.request({
      url: 'https://www.bjccc.top/function/bookWish',
      data:{
        bookId:bookinfo.novel_id
      },
      success(res){
        if(res.data.code == 'success'){
          that.setData({
            wishCount:res.data.result[0].kk
          })
        }
      }
    })
    // 获得所有评论数据
    wx.request({
      url: 'https://www.bjccc.top/comment/getCommentAll',
      data:{
        id:bookinfo.novel_id
      },
      success(res){
        if(res.data.code == 'success'){
          let hots = 0
          for(var i in res.data.result){
            hots += Number(res.data.result[i].score)
          }
          that.setData({
            commentCount:res.data.result.length,
            hots:hots
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this
    var query = wx.createSelectorQuery();
    query.select('.book-intro').boundingClientRect(rect=>{
      let height = rect.height;
      if(height<80){
        that.setData({
          showSwitch:false
        })
      }else{
        that.setData({
          showSwitch:true
        })
      }
    }).exec();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    if(app.globalData.userInfo){
      that.setData({
        hasLogin:true
      })
      // 查看书籍是否在书架中
        wx.request({
          url: 'https://www.bjccc.top/user/checkBookShelf',
          data:{
            userName:app.globalData.userInfo.nickName,
            bookId:that.data.bookinfo.novel_id
          },
          success(res){
            if(res.data.result.length != 0){
              that.setData({
                hasBook:true
              })
            }
          }
        })
    }else{
      that.setData({
        hasLogin:false
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
  showSwitch:function(){
    const that = this
    that.setData({
      txtHidden:!that.data.txtHidden
    })
  },
  // 去写评论
  writeComment:function(){
    const that = this
    if(!app.globalData.userInfo){
      wx.getUserProfile({
      desc: '用户授权登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        that.setData({
          userinfo: res.userInfo,
          showPop:true
        })
        wx.setStorage({
          data: res.userInfo,
          key: 'userinfo',
        })
        app.globalData.userInfo = res.userInfo
        that.onShow()
      },
      fail(){
          return;
      }
    })
    }else{
      that.setData({
        showPop:true
      })
    }
  },
  // 五角星评分
  score:function(e){
    var that=this;
    for(var i=0;i<that.data.stars.length;i++){
      var allItem = 'stars['+i+'].flag';
      that.setData({
        [allItem]:1
      })
    }
    var index=e.currentTarget.dataset.index;
    for(var i=0;i<=index;i++){
      var item = 'stars['+i+'].flag';
      that.setData({
        [item]:2
      })
    }
    that.setData({
      starScore:index
    })
  },
  // 取消评论
  cancel_comment:function(){
    const that = this
    that.setData({
      starScore:'',
      showPop:false,
      userComment:''
    })
    for(var i=0;i<that.data.stars.length;i++){
      var allItem = 'stars['+i+'].flag';
      that.setData({
        [allItem]:1
      })
    }
  },
  // 发表评论
  submit_comment:function(ev){
    const that = this
    const bookId = ev.currentTarget.dataset.bookinfo
    if(that.data.starScore === ''){
      wx.showToast({
        title: '请先评分再发表',
        icon:'none',
      })
    }else{
      let userInput = ''
      if(that.data.userComment.trim() === ''){
        userInput = that.data.stars[that.data.starScore].tip
      }else{
        userInput = that.data.userComment
      }
      wx.request({
        url: 'https://www.bjccc.top/comment/publishComment',
        data:{
          id : bookId,
          comment : userInput,
          score: Number(that.data.starScore) + 1,
          name : app.globalData.userInfo.nickName,
          header : app.globalData.userInfo.avatarUrl
        },
        success(res){
          if(res.data.code == 'success'){
            wx.showToast({
              title: '发表成功',
              icon:'none'
            })
            setTimeout(() => {
                that.setData({
                  showPop:false
                },()=>{
                  that.setData({
                    starScore:'',
                    userComment:'',
                  })
                  for(var i=0;i<that.data.stars.length;i++){
                    var allItem = 'stars['+i+'].flag';
                    that.setData({
                      [allItem]:1
                    })
                  }
                  that.onLoad()
                })
            }, 1500);
          }
        }
      })
    }
  },

  getValue: function(ev){
    const that = this
    that.setData({
      userComment:ev.detail.value
    })
  },

  //转换时间格式
   rTime:function(date){
     var d = new Date(date)
     var month = d.getMonth()+1
     var day = d.getDate()
     var hour = d.getHours()
     var min = d.getMinutes()
     var sec = d.getSeconds()
     var result = d.getFullYear() + '/'
     if(month<10){
        result += '0' + month + '/'
     }else{
       result += month + '/'
     }
     if(day<10){
        result += '0' + day + ' '
     }else{
        result += day + ' '
     }
     if(hour<10){
      result += '0' + hour + ':'
    }else{
      result += hour + ':'
    }
    if(min<10){
      result += '0' + min + ':'
    }else{
      result += min + ':'
    }
    if(sec<10){
      result += '0' + sec
    }else{
      result += sec
    }
    return result
  },

  //跳转到所有评论页面
  moreComment:function(){
    const that = this
    const bookId = that.data.bookinfo.novel_id
    wx.navigateTo({
      url: `/pages/moreComment/moreComment?bookId=${bookId}`,
    })
  },
  //跳转到阅读页
  readPage:function(){
    const that = this
    const bookId = that.data.bookinfo.novel_id
    const bookName = that.data.bookinfo.novel_name
    wx.navigateTo({
      url: `/pages/readPage/readPage?bookId=${bookId}&bookName=${bookName}`,
    })
  },
  // 未登录 点击加入书架授权
  userLogin:function(){
    const that = this
    wx.getUserProfile({
      desc: '用户授权登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        that.setData({
          userinfo: res.userInfo,
          hasLogin:true
        })
        wx.setStorage({
          data: res.userInfo,
          key: 'userinfo',
        })
        app.globalData.userInfo = res.userInfo
        that.onShow()
      },
      fail(){
          return;
      }
    })
  },
  // 加入书架
  addBook:function(){
    const that = this
    wx.request({
      url: 'https://www.bjccc.top/user/addUserShelf',
      data:{
        userName:app.globalData.userInfo.nickName,
        bookId:that.data.bookinfo.novel_id
      },
      success(res){
        if(res.data.code == 'success'){
          wx.showToast({
            title: '加入书架成功',
            icon:'none'
          })
          that.setData({
            hasBook:true
          })
        }
      }
    })
  }
})