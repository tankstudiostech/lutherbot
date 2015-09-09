var express = require('express');
var app = express();
var request = require('request');
var biblia = require('./lib/biblia');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(process.env.PORT || 5000);
app.get('/getverse', function (req, res) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  var text = req.query.text;
  if (text != undefined) {
    console.log("Body Text: " + text);
    
    biblia.getVerse(text, function(data) {
      res.send(data);
    });
  }
  else {
    res.send("{\"err\":\"Text parameter not defined in body\"}");
  }
});