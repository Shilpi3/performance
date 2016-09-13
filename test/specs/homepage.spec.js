var httpServer = require('http-server');
var path = require('path');
var root = path.join(__dirname + '../../../webapp');
var server = httpServer.createServer({root: root});
server.listen(8887, function (){
  console.log('Server started at 8887');
});

var webdriverio = require('webdriverio');
var options = {desiredCapabilities: {browserName: 'chrome'}};
var client = webdriverio.remote(options);
client
  .init()
  // .url('https://duckduckgo.com/')
  // .setValue('#search_form_input_homepage', 'WebdriverIO')
  // .click('#search_button_homepage')
  // .getTitle().then(function(title) {
  //   console.log('Title is: ' + title);
  //   // outputs: "Title is: WebdriverIO (Software) at DuckDuckGo"
  // })
  .url('http://localhost:8887/')
  .getTitle().then(function(title) {
    console.log('Title is: ' + title);
  })
  .execute('return {a:123}');
  //.end();
