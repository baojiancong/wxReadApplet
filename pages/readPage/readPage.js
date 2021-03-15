// pages/readPage/readPage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stoArr:[], //存放缓存数据
    canGo:true,
    sort:true,
    catalogInfo:[],
    chapterInfo:[],
    chapterContent:[],
    curChapter:0,
    catalogPop:false,
    showPop:false,
    fontPop:false,
    fontSize:12,
    isDay:true,
    scrollTop:-1,
    storageTop:0,
    showNextBtn:false,
    hasSto:false,
    bookId:null,
    hasInShelf:false,
    unLogin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    // 判断用户是否授权登录
    wx.getSetting({
      withSubscriptions: true,
      success(res){
        if(res.authSetting['scope.userInfo']){
          console.log('登录')
          that.setData({
            hasLogin:true
          })
            // 查看书籍是否在书架中
            wx.request({
              url: 'http://47.102.201.120:8080/checkBookShelf',
              data:{
                userName:app.globalData.userInfo.nickName,
                bookId:that.data.bookId
              },
              success(res){
                if(res.data.length != 0){
                  that.setData({
                    hasInShelf:true
                  })
                }
              }
            })
        }else{
          console.log('未登录')
          that.setData({
            hasLogin:false
          })
        }
      }
    })
    that.setData({
      bookId:options.bookId
    })
    wx.getStorage({
      key: 'fontSize',
      success(res){
        that.setData({
          fontSize:res.data
        })
      }
    })
    wx.getStorage({
      key: 'bookShelf',
      success(res){
        console.log(res.data)
       for(var i in res.data){
         if(res.data[i].bookId == that.data.bookId){
           that.setData({
             curChapter:res.data[i].curChapter,
             storageTop:res.data[i].storageTop,
             hasSto:true
           })
         }
       }
       that.setData({
          stoArr:res.data
       })
      }
    })
    
    wx.setNavigationBarTitle({
      title: options.bookName,
    })
    // 获得第一章内容 如果有缓存 则读取缓存章节。
    wx.request({
      url: 'http://47.102.201.120:8080/getChapter',
      data:{
        bookId:options.bookId,
        chapterId: that.data.curChapter
      },
      success(res){
        that.setData({
          chapterInfo:res.data[0],
          chapterContent:app.textHandle(res.data[0].chapter_content),
        },()=>{
          that.setData({
            showNextBtn:true,
            scrollTop:that.data.storageTop || 0
          })
        })
      }
    })
    // 取章节目录
    wx.request({
      url: 'http://47.102.201.120:8080/getCatalog',
      data:{
        bookId:options.bookId,
      },
      success(res){
        that.setData({
          catalogInfo:res.data
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
      const that = this
      const bookInfo = {
        "1":{
          bookId:that.data.bookId,
          storageTop:that.data.storageTop,
          curChapter:that.data.curChapter
        }
      }
      // 书本信息存入数组
      for(var i in bookInfo){
        that.data.stoArr.push(bookInfo[i])
      }
      wx.getStorage({
        key: 'bookShelf',
        success(res){
          if(that.data.hasSto){
            for(var i in res.data){
              if(res.data[i].bookId == that.data.bookId){
                res.data[i].storageTop = that.data.storageTop
                res.data[i].curChapter = that.data.curChapter
                console.log(res.data)
                wx.setStorage({
                  data: res.data,
                  key: 'bookShelf',
                })
              }
            }
          }else{
            wx.setStorage({
              data: that.data.stoArr,
              key: 'bookShelf',
            })
          }
        },
        fail(){
          wx.setStorage({
            data: that.data.stoArr,
            key: 'bookShelf',
          })
        }
      })

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
  show:function(){
    const that = this
    that.setData({
      showPop:that.data.catalogPop ? that.data.showPop : that.data.fontPop ? that.data.showPop  : !that.data.showPop,
      fontPop:false,
      catalogPop:false,
      canGo:!that.data.canGo
    })
  },
  // 设置字体弹窗
  useFont:function(){
    const that = this
    that.setData({
      showPop:false,
      fontPop:true
    })
  },
  // 增大字体
  addFont:function(){
    const that = this  
    if(that.data.fontSize >=20){
      wx.showToast({
        title: '字体已经是最大了...',
        icon:'none'
      })
    }else{
      that.setData({
        fontSize:that.data.fontSize + 2
      },()=>{
        wx.setStorage({
          data: that.data.fontSize,
          key: 'fontSize',
        })
      })
    }
  },
  downFont:function(){
    const that = this
    if(that.data.fontSize <= 12){
      wx.showToast({
        title: '字体已经是最小了...',
        icon:'none'
      })
    }else{
      that.setData({
        fontSize:that.data.fontSize - 2
      },()=>{
        wx.setStorage({
          data: that.data.fontSize,
          key: 'fontSize',
        })
      })
    }
  },
  changeDay:function(){
    const that = this
    that.setData({
      isDay:!that.data.isDay
    })
  },
  // 显示隐藏目录
  showCatalog:function(){
    const that = this
    that.setData({
      catalogPop:true,
      showPop:false,
      canGo:false
    })
  },
  sort:function(){
    const that = this
    that.setData({
      sort:!that.data.sort,
      catalogInfo:that.data.catalogInfo.reverse()
    })
  },
  getScrollTop(event){
    const that = this
    that.setData({
     storageTop : event.detail.scrollTop
    })
  },
  // 上一章
  preChapter:function(){
    const that = this
    if(that.data.curChapter >= 1){
      wx.request({
        url: 'http://47.102.201.120:8080/getChapter',
        data:{
          bookId:that.data.bookId,
          chapterId: that.data.curChapter - 1
        },
        success(res){
          console.log(res)
          that.setData({
            chapterInfo:res.data[0],
            chapterContent:app.textHandle(res.data[0].chapter_content),
            curChapter: that.data.curChapter - 1
          })
        }
      })
    }else{
      wx.showToast({
        title: '当前已经是第一章了...',
        icon:'none'
      })
    }

  },
  // 下一章
  nextChapter:function(){
    const that = this
    wx.request({
      url: 'http://47.102.201.120:8080/getChapter',
      data:{
        bookId:that.data.bookId,
        chapterId: that.data.curChapter + 1
      },
      success(res){
        if(res.data.length != 0){
          that.setData({
            chapterInfo:res.data[0],
            chapterContent:app.textHandle(res.data[0].chapter_content),
            curChapter: that.data.curChapter + 1,
            scrollTop:0,
          })
        }else{
          wx.showToast({
            title: '当前已经是最后一章了...',
            icon:'none'
          })
        }
      }
    })
  },
  // 目录 选择章节
  chooseChapter:function(e){
    let chapterSel = e.currentTarget.dataset.index
    const that = this
    let {sort,catalogInfo} = that.data
    if(that.data.curChapter == chapterSel && sort || !sort && catalogInfo.length-1 - chapterSel == that.data.curChapter){
      wx.showToast({
        title: '已经是选择章节了...',
        icon:'none'
      })
    }else{
      wx.request({
        url: 'http://47.102.201.120:8080/getChapter',
        data:{
          bookId:that.data.bookId,
          chapterId: that.data.sort ? chapterSel : that.data.catalogInfo.length-1-chapterSel
        },
        success(res){
          if(res.data.length != 0){
              that.setData({
                chapterInfo:res.data[0],
                chapterContent:app.textHandle(res.data[0].chapter_content),
                scrollTop:that.data.scrollTop == 0 ? -1 : 0,
                curChapter: that.data.sort ? chapterSel : that.data.catalogInfo.length-1-chapterSel,
                catalogPop:false,
                canGo:true
            })
          }
        }
      })
    }
  },
  // 加入书架
  addShelf:function(){
    const that = this
    let {bookId} = that.data
      wx.request({
        url: 'http://47.102.201.120:8080/addUserShelf',
        data:{
          userName:app.globalData.userInfo.nickName,
          bookId
        },
        success(res){
          if(res.data.affectedRows == 1){
            wx.showToast({
              title: '加入书架成功',
              icon:'none'
            })
            that.setData({
              hasInShelf:true
            })
          }
        }
      })
  },
  bindgetuserinfo:function(res){
    const that = this
    // 如果同意
    if(res.detail.userInfo){
      app.globalData.userInfo = res.detail.userInfo
      that.setData({
        hasLogin:true
      })
    }
  }
})