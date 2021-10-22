var fs = require('fs');
const fse = require('fs-extra')
var express = require('express');
var app = express();

app.use(express.static('static'));
app.use(express.static('dist'));

app.get('/', function (req, res) {
   fs.readFile('static/index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})

var loadMultipleJsFiles = (newFilePath, filesList)=>{
      var promises = filesList.map(function(filePath){
         return new Promise(function(resolve, reject){
            fs.readFile("src/js/"+filePath, 'utf8', function(err, data) {
               if(!err){
                  resolve(data);
               }else{
                  console.log(err);
               }
            });
         })
      });
      Promise.all(promises)
      .then(result => {
         fs.writeFile('./dist/'+newFilePath, result.join("\r\n"), function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
      });
}

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://chatbot.com", host, port);

   loadMultipleJsFiles('js/embed.js',[
      'shared/usestrict.js',
      'embed/config.js',
      'shared/util.js',
      'shared/postman.js',
      'shared/useragent.js',
      'shared/datetime.js',
      'embed/helper.js',
      'embed/channel.js',
      'embed/index.js',
      'embed/visitor.js'
   ]);
   loadMultipleJsFiles('js/chatbot.js',[
      'shared/usestrict.js',
      'shared/util.js',
      'shared/postman.js',
      'shared/bubble-variables.js',
      'shared/userdata.js',
      'chatbot/channel.js',
      'chatbot/vue.js',
      'chatbot/chatbot-welcome.js',
      'chatbot/chatbot-live.js',
      'chatbot/index.js',
      
   ]);
   fse.copy('./src', './dist');

})