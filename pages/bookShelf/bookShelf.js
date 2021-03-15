// pages/bookShelf/bookShelf.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:[],
    hasLogin:false,
    shelfInfo:[],
    delBtnWidth:160,
    isScroll:true,
    noBook:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的书架',
    })
    const that = this
    // 用户是否授权登录。
    wx.getSetting({
      success(res){
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
        // 读取用户书籍记录
        wx.request({
          url: 'http://47.102.201.120:8080/getAllUserBook',
          data:{
            userName:app.globalData.userInfo.nickName,
          },
          success(res){
            if(res.data.length != 0){
              that.setData({
                noBook:false,
                shelfInfo:res.data
              },()=>{
                wx.getStorage({
                  key: 'bookShelf',
                  success(res){
                    let {shelfInfo} = that.data
                    for(var i in shelfInfo){
                      for(var j in res.data){
                        if(shelfInfo[i].novel_id == res.data[j].bookId){
                          var item = shelfInfo[i]
                          item.curChapter = res.data[j].curChapter
                        }
                      }
                    }
                    that.setData({
                      shelfInfo:shelfInfo
                    })
                  }
                })
              })
            }else{
              that.setData({
                noBook:true
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
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
  // 添加新书
  addNewBook:function(){
    wx.switchTab({
      url: '/pages/bookLibrary/bookLibrary',
    })
  },
  // 授权
  bindgetuserinfo:function(res){
    const that = this
    if(res.detail.userInfo){
      app.globalData.userInfo = res.detail.userInfo
        wx.showToast({
          title: '授权登录成功',
        })
        setTimeout(()=>{
          that.setData({
            hasLogin:true
          })
          this.onLoad()
        },1500)
    }
  },
  // 跳转到阅读页面
  goBookDetail:function(ev){
    const that = this
    let bookId = ev.currentTarget.dataset.id
    let bookname = ev.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/readPage/readPage?bookId=${bookId}&bookName=${bookname}`,
    })
  },
  // 手指触摸开始
  touchStart:function(e){
    const that = this

    let {shelfInfo} = that.data
    for(var i in shelfInfo){
      var item = shelfInfo[i]
      item.right = 0
    }
    // 记录手指最初触碰的位置,更新数组每一项加入right
    that.setData({
      shelfInfo,
      startX : e.touches[0].clientX
    })
  },
  // 手指触摸后移动
  touchMove:function(e){
    const that = this
    let {shelfInfo,startX,delBtnWidth} = that.data
    // 获取点击的那个item的id
    var item = shelfInfo[e.currentTarget.dataset.index]
    // 手指移动的位置
    var moveX = e.touches[0].clientX
    // 与起始点的位置
    var disX = startX - moveX

    if(disX > 20){
      if(disX > delBtnWidth){
        disX = delBtnWidth
      }
      item.right = disX
      that.setData({
        isScroll:false,
        shelfInfo
      })
    }else{
      item.right = 0
      that.setData({
        isScroll:true,
        shelfInfo
      })
    }
  },
  // 手指触摸结束
  touchEnd:function(e){
    const that = this
    let {shelfInfo,delBtnWidth} = that.data
    var item = shelfInfo[e.currentTarget.dataset.index]

    if(item.right >= delBtnWidth/2){
      item.right = delBtnWidth
      that.setData({
        isScroll:true,
        shelfInfo
      })
    }else{
      item.right=0,
      that.setData({
        isScroll:false,
        shelfInfo
      })
    }
  },
  // 删除图书
  delBook:function(e){
    const that = this
    let bookInfo = that.data.shelfInfo[e.currentTarget.dataset.index]
    wx.showModal({
      title: '',
      content: '是否确认删除',
      success(res) {
       if (res.confirm) {
        wx.request({
          url: 'http://47.102.201.120:8080/delBook',
          data:{
            bookId:bookInfo.novel_id,
            userName:bookInfo.userName
          },
          success(res){
            if(res.data.affectedRows == 1){
              wx.showToast({
                title: '删除成功',
                icon:'none'
              })
            }else{
              wx.showToast({
                title: '删除失败,请稍后重试',
                icon:'none'
              })
            }
            that.onLoad()
          }
        })
       }
      }
     })
  }
})