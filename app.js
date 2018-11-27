(function ($) {
  var JSonToCSV = {
    /*
     * obj是一个对象，其中包含有：
     * ## data 是导出的具体数据
     * ## fileName 是导出时保存的文件名称 是string格式
     * ## showLabel 表示是否显示表头 默认显示 是布尔格式
     * ## columns 是表头对象，且title和key必须一一对应，包含有
          title:[], // 表头展示的文字
          key:[], // 获取数据的Key
          formatter: function() // 自定义设置当前数据的 传入(key, value)
     */
    setDataConver: function(obj) {
      var bw = this.browser();
      if(bw['ie'] < 9) return; // IE9以下的
      var data = obj['data'],
          ShowLabel = typeof obj['showLabel'] === 'undefined' ? true : obj['showLabel'],
          fileName = (obj['fileName'] || 'UserExport') + '.csv',
          columns = obj['columns'] || {
              title: [],
              key: [],
              formatter: undefined
          };
      var ShowLabel = typeof ShowLabel === 'undefined' ? true : ShowLabel;
      var row = "", CSV = '', key;
      // 如果要现实表头文字
      if (ShowLabel) {
          // 如果有传入自定义的表头文字
          if (columns.title.length) {
              columns.title.map(function(n) {
                  row += n + ',';
              });
          } else {
              // 如果没有，就直接取数据第一条的对象的属性
              for (key in data[0]) row += key + ',';
          }
          row = row.slice(0, -1); // 删除最后一个,号，即a,b, => a,b
          CSV += row + '\r\n'; // 添加换行符号
      }
      // 具体的数据处理
      data.map(function(n) {
          row = '';
          // 如果存在自定义key值
          if (columns.key.length) {
              columns.key.map(function(m) {
                  row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(m, n[m]) || n[m] : n[m]) + '",';
              });
          } else {
              for (key in n) {
                  row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(key, n[key]) || n[key] : n[key]) + '",';
              }
          }
          row.slice(0, row.length - 1); // 删除最后一个,
          CSV += row + '\r\n'; // 添加换行符号
      });
      if(!CSV) return;
      this.SaveAs(fileName, CSV);
    },
    SaveAs: function(fileName, csvData) {
      var bw = this.browser();
      if(!bw['edge'] && !bw['ie']) {
        var alink = document.createElement("a");
        alink.id = "linkDwnldLink";
        alink.href = this.getDownloadUrl(csvData);
        document.body.appendChild(alink);
        var linkDom = document.getElementById('linkDwnldLink');
        linkDom.setAttribute('download', fileName);
        linkDom.click();
        document.body.removeChild(linkDom);
      }
      else if(bw['ie'] >= 10 || bw['edge'] == 'edge') {
        var _utf = "\uFEFF";
        var _csvData = new Blob([_utf + csvData], {
            type: 'text/csv'
        });
        window.navigator.msSaveBlob(_csvData, fileName);
      }
      else {
        var oWin = window.top.open("about:blank", "_blank");
        oWin.document.write('sep=,\r\n' + csvData);
        oWin.document.close();
        oWin.document.execCommand('SaveAs', true, fileName);
        oWin.close();
      }
    },
    getDownloadUrl: function(csvData) {
      var _utf = "\uFEFF"; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
      if (window.Blob && window.URL && window.URL.createObjectURL) {
          var csvData = new Blob([_utf + csvData], {
              type: 'text/csv'
          });
          return URL.createObjectURL(csvData);
      }
      // return 'data:attachment/csv;charset=utf-8,' + _utf + encodeURIComponent(csvData);
    },
    browser: function() {
      var Sys = {};
      var ua = navigator.userAgent.toLowerCase();
      var s;
      (s = ua.indexOf('edge') !== - 1 ? Sys.edge = 'edge' : ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]:
          (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
          (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
          (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
          (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
          (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
      return Sys;
    }
  }


  var app = new Vue({
    el: '#main',
    data: {
      upload: {
        apiName: 'S3280201',
        password: 'pwd3669175',
        mobiles: ''
      },
      result: []
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
      clickDownload(){
        JSonToCSV.setDataConver({
          data: this.result,
          fileName: '下载',
          columns: {
            title: ['手机号码','地区','号码类型','结果'],//csv表头
            key: ['mobile', 'area', 'numberType','status'],
            formatter: function(n, v) {
            if(n === 'status') {
              if(v === '0'){
                v = '空号'
              }else if(v === '1'){
                v = '实号'
              }else if(v === '2'){
                v = '停机'
              }else if(v === '3'){
                v = '库存'
              }else if(v === '4'){
                v = '沉默号'
              }
         
              return v
            }
            if(v === undefined){
              return " ";
            }
            }
          }
        });
      }
    },
    filters: {
      showStatus: function (val) {
        if (!val) return ''

        if(val === '0'){
          val = '空号'
        }else if(val === '1'){
          val = '实号'
        }else if(val === '2'){
          val = '停机'
        }else if(val === '3'){
          val = '库存'
        }else if(val === '4'){
          val = '沉默号'
        }
   
        return val
      }
    }
  })
})(jQuery)