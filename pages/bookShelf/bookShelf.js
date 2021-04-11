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
    showChoose:false,
    delList:[],
    all:false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的书架',
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
  if(app.globalData.userInfo){
    // 读取用户书籍记录
    that.setData({
      hasLogin:true,
      userinfo:app.globalData.userInfo
    })
    wx.request({
      url: 'https://www.bjccc.top/user/getAllUserBook',
      data:{
        userName:app.globalData.userInfo.nickName,
      },
      success(res){
        if(res.data.code == 'success'){
          if(res.data.result.length != 0){
            for(var i in res.data.result){
              var temp = res.data.result[i]
              temp.isChoose = false
            }
            that.setData({
              shelfInfo:res.data.result
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
          }
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
  // 添加新书
  addNewBook:function(){
    wx.switchTab({
      url: '/pages/bookLibrary/bookLibrary',
    })
  },
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
      },
      fail(){
          return;
      }
    })
  },

  // 
  userLogin:function(e){
    const that = this
    wx.getUserProfile({
    desc: '用户授权登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      that.setData({
        hasLogin: true
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
  // 跳转到阅读页面
  goBookDetail:function(ev){
    const that = this
    let bookId = ev.currentTarget.dataset.id
    let bookname = ev.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/readPage/readPage?bookId=${bookId}&bookName=${bookname}`,
    })
  },
  // 管理图书
  manager:function(){
    const that = this
    const {shelfInfo} = that.data
    for(var i in shelfInfo){
      shelfInfo[i].isChoose = false
    }
    that.setData({
      showChoose:!that.data.showChoose,
      shelfInfo
    })
  },
  // 删除图书
  delBook:function(e){
    const that = this
    let {delList,userinfo} = that.data
    wx.request({
      url: 'https://www.bjccc.top/user/delBook',
      data:{
        name:userinfo.nickName,
        list:delList
      },
      success(res){
        console.log(res,22)
        if(res.data.code == 'success'){
          wx.showToast({
            title: '删除成功',
          })
          //清除该书本的缓存
          wx.getStorage({
            key: 'bookShelf',
            success(res){
              for(var i in delList){
                for(var j in res.data){
                  if(delList[i] == res.data[j].bookId){
                      res.data.splice(j,1) //删除缓存中的这本书
                  }
                }
              }
              wx.setStorage({
                data: res.data,
                key: 'bookShelf',
              })
            }
          }) 

          // 页面重新渲染
          wx.request({
            url: 'https://www.bjccc.top/user/getAllUserBook',
            data:{
              userName:app.globalData.userInfo.nickName,
            },
            success(res){
              if(res.data.code == 'success'){
                if(res.data.result.length != 0){
                  that.setData({
                    shelfInfo:res.data.result,
                    delList:[],
                    showChoose:false
                  })
                }else{
                  that.setData({
                    shelfInfo:res.data.result,
                    delList:[],
                    showChoose:false
                  })
                }
              }
            }
          })
        }
      },
      fail(err){
        console.log(err)
      }
    })
  },

  // 全选
  chooseAll:function(){
    const that = this
    let {shelfInfo,all} = that.data

    for(var i in shelfInfo){
      var temp = shelfInfo[i]
      temp.isChoose = !all
    }

    that.setData({
      shelfInfo,
      all:!all,
    },()=>{
      const list = []
      if(!all){
        shelfInfo.map((item,index)=>{
          list.push(item.novel_id)
        })
      }
      that.setData({
        delList:list
      })
    })
  },
  chooseBook:function(ev){
    const that = this
    const list = []
    let index = ev.currentTarget.dataset.index
    let {shelfInfo} = that.data
    shelfInfo[index].isChoose = !shelfInfo[index].isChoose

    that.setData({
      shelfInfo,
    },()=>{
        shelfInfo.map((item,index)=>{
          if(item.isChoose){
            list.push(item.novel_id)
          }
        })
        that.setData({
          delList:list
        })
    })
  }
})