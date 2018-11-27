const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')

var params = "C:\fakepath\号码.txt"
// module.exports = function readAndWriteFile(path) {
  fs.readFile(params, function (err, data) {
    if (err) throw err
    var parser = new xml2js.Parser()
    var xml = data.toString()
  
    parser.parseString(xml, function (err, result) {
      if (err) throw err
  
      var data = JSON.stringify(result.root.ok_list)
      var newJson = []
  
      var durtime = JSON.parse(data)[0].record[0].$.durtime
      var sentence_list = JSON.parse(data)[0].record[0].sentence_list[0].sentence
      sentence_list.map(function (it) {
        return it.$.text.trim()
      })
      // console.log(sentence_list[0].$.text.replace(/\s+/g, ''))
  
      sentence_list.forEach(function (item) {
        newJson.push({
          sentence: {
            start_time: item.$.start_time,
            end_time: item.$.end_time,
            role: item.$.role,
            text: item.$.text.replace(/\s+/g, ''),
            speed: item.$.speed
          }
        })
      })
      console.log(newJson)
  
      fs.writeFile(path.join(__dirname, '/data/data.js'), JSON.stringify({
        durtime: durtime,
        sentence_list: newJson
  
      }), function (err) {
        if (err) throw err
        console.log('文件写好了@老板')
      })
    })
  })
// }
