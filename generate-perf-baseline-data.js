"use strict";
var httpServer = require('http-server');
var path = require('path');
var root = path.join(__dirname + '/webapp');
console.log('ROOT:' + root);
var server = httpServer.createServer({ root: root });
// Start local web server
server.listen(8887, function() {
  console.log('Server started at 8887');
});

var webdriverio = require('webdriverio');
var options = { desiredCapabilities: { browserName: 'chrome' } };
var client = webdriverio.remote(options);
var data = client
  .init()
  .url('http://127.0.0.1:8887/')
  .getTitle().then(function(title) {
    console.log(title || 'NO PAGE' + ' is loaded..');
  })
  .execute(function() {
    return 1111;
  }).then(function(data){
    console.log('DATA:' + JSON.stringify(data));
  });


