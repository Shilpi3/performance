before(function(){
  browser.url('http://127.0.0.1:8886/');
  browser.pause(4000);
});

describe('DuckDuckGo search', function() {

    it('launches local web server', function(){
        var title = browser.getTitle();
        console.log('Home Page Title is:' + title);
    });
    it('executes javascript', function(){
        var x = browser.execute('var x = {a:"123"}; return x;');
        console.log(x);
    });
    it('executes shape client', function(){
        var x = browser.execute(function (){
          return getPerfData();
        });
        console.log(JSON.stringify(x));
    });
});