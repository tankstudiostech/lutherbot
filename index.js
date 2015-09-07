var express = require('express');
var app = express();
var request = require('request');
var biblia = require('./biblia');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.listen(process.env.PORT || 5000);
app.post('/getverse', function (req, res) {
  var text = req.body.text;
  if (text != undefined) {
    console.log("Body Text: " + text);
    
    biblia.getVerse(req.body.text, function(data) {
      res.send(data);
    });
  }
  else {
    res.send("Text not defined in body");
  }
});

this.sendResponse = function(res) {
  
}