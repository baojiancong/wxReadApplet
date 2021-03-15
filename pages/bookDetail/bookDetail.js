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
      url: 'http://47.102.201.120:8080/getComment',
      data:{
        id:bookinfo.novel_id
      },
      success(res){
        if(res.data.length > 0){
          for(var i in res.data){
            res.data[i].comment_time = that.rTime(res.data[i].comment_time)
          }
        }
        that.setData({
          commentinfo:res.data,
        })
      }
    })
    // 获得收藏数量
    wx.request({
      url: 'http://47.102.201.120:8080/bookWish',
      data:{
        bookId:bookinfo.novel_id
      },
      success(res){
        that.setData({
          wishCount:res.data[0].kk
        })
      }
    })
    // 获得所有评论数据
    wx.request({
      url: 'http://47.102.201.120:8080/getCommentAll',
      data:{
        id:bookinfo.novel_id
      },
      success(res){
        let hots = 0
        for(var i in res.data){
          hots += Number(res.data[i].score)
        }
        that.setData({
          commentCount:res.data.length,
          hots:hots
        })
      }
    }),

    // 判断用户是否授权登录
    wx.getSetting({
      withSubscriptions: true,
      success(res){
        if(res.authSetting['scope.userInfo']){
          that.setData({
            hasLogin:true
          })
          // 查看书籍是否在书架中
            wx.request({
              url: 'http://47.102.201.120:8080/checkBookShelf',
              data:{
                userName:app.globalData.userInfo.nickName,
                bookId:that.data.bookinfo.novel_id
              },
              success(res){
                if(res.data.length != 0){
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
    wx.getSetting({
      success(res){
        if(!res.authSetting['scope.userInfo']){
          wx.showModal({
            title:'注意',
            content:'您需要先授权登录才能进行评论!',
            showCancel:false,
            confirmText:'前往登录',
            success:function(res){
            if (res.confirm){
              var pages = getCurrentPages()    //获取加载的页面
              var currentPage = pages[pages.length-1]    //获取当前页面的对象
              var options = currentPage.options    //如果要获取url中所带的参数可以查看options
              app.globalData.bookInfo = options          
              wx.switchTab({
                url: `../personalCenter/personalCenter`,
              })
            }}
          })
        }else{
          that.setData({
            showPop:true
          })
        }
      }
    })
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
      if(that.data.userComment === ''){
        userInput = that.data.stars[that.data.starScore].tip
      }else{
        userInput = that.data.userComment
      }
      wx.request({
        url: 'http://47.102.201.120:8080/userComment',
        data:{
          id : bookId,
          comment : userInput,
          score: Number(that.data.starScore) + 1,
          name : app.globalData.userInfo.nickName,
          header : app.globalData.userInfo.avatarUrl
        },
        success(res){
          if(res.data == 'success'){
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
    var json_date = new Date(date).toJSON();
    return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
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
  bindgetuserinfo:function(res){
    const that = this
    if(res.detail.userInfo){
      app.globalData.userInfo = res.detail.userInfo
      wx.showToast({
        title: '登录成功',
        icon:'none'
      })
      setTimeout(() => {
        that.setData({
          hasLogin:true
        })
        this.onLoad()
      }, 1500);

    }
  },
  // 加入书架
  addBook:function(){
    const that = this
    console.log(1111)
    wx.request({
      url: 'http://47.102.201.120:8080/addUserShelf',
      data:{
        userName:app.globalData.userInfo.nickName,
        bookId:that.data.bookinfo.novel_id
      },
      success(res){
        if(res.data == 'success'){
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