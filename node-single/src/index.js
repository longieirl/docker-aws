var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static(__dirname + '/static'));

// Application Settings
var httpPort = 9000;

app.get('/', function (req, res) {
  res.json({message: 'Hello'});
});

app.get('/api', function (req, res) {
    res.json({message: 'API is running'});
});

var server = app.listen(httpPort, function () {

  console.log('Example app listening at port', httpPort);

});