// import readAndWriteFile from './index.js'
(function ($) {
  var app = new Vue({
    el: '#main',
    data: {
      upload: {
        apiName: 'S3280201',
        password: 'pwd3669175',
        mobiles: ''
      },
      result: [],
      showTable: false
    },
    methods: {
      handleChange:function (e) {
        var that = this
        console.log(1)
        var filename=e.target.files[0].name;
        var rABS = typeof FileReader !== 'undefined' && typeof FileReader.prototype !== 'undefined' && typeof FileReader.prototype.readAsBinaryString !== 'undefined';  
        var reader=new FileReader();
        if(rABS){
          reader.readAsBinaryString(e.target.files[0]);//发起异步请求
        }else{
          reader.readAsArrayBuffer(e.target.files[0]);//发起异步请求
        }
    
		  reader.onload = function(e) {
        var data = e.target.result;
        that.upload.mobiles = data
      //   console.log(data)
      //   var str = null;
      //   var viewBuf = null;
      //   if(rABS) {
      //    str = data;
      //    var newArray = [];
      //    for (var index = 0; index < data.length; index++) {
      //        newArray.push(data.charCodeAt(index));
      //    }
      //    viewBuf = new Uint8Array(newArray);
      // }
       }
      },
      uploadFile:function () {
      var that = this
      console.log(this.upload.mobiles)
        if (this.upload.mobiles === '') {
          alert('请选择一个文件上传')
          return
        }

      $.ajax({
        url: 'https://kh_bd.253.com//feign/apiMobileTest/findByMobiles',
        type: 'post',
        data: this.upload,
        cache: false,
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
          if(data.resultCode === '000000'){
            $('#table').removeClass('display')
            that.result = data.resultObj
            console.log(that.result)
          } else {
            alert('上传文件失败，请重新尝试！')
          }
          
        },
        error: function (err) {
          alert('上传文件失败，请重新尝试！')
        }
      })

      },
      download: function () {
        
      }
    },
    filters: {
      showStatus: function (val) {
        if (!val) return ''
        switch (val) {
          case 0:
            val.replace(/[\d]+/,'空号')
            break;
          case 1:
          val.replace(/[\d]+/,'实号')
            break;
          case 2:
          val.replace(/[\d]+/,'停机')
            break;
          case 3:
          val.replace(/[\d]+/,'库无')
            break;
          case 4:
          val.replace(/[\d]+/,'沉默号')
            break;
        }
      }
    }
  })
})(jQuery)