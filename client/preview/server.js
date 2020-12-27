var express = require('express');
var app = express();
var port = 1234;

app.use(express.static('public'));

app.listen(port, function () {
  console.log('Example app listening at http://localhost:' + port);
});
