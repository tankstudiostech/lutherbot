var express = require('express');
var app = express();
var request = require('request');
var biblia = require('./lib/bibliaApiWrapper');
var bibliaUrlBuilder = require('./lib/bibliaUrlBuilder');

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var bibliaToken;
var bibliaDefaultToken;

if((process.env.heroku || 'false') === 'true') {
  bibliaToken = process.env.bibliaToken;
  bibliaDefaultToken = process.env.bibliaDefaultToken;
}
else {
  var config = require('./config');
  bibliaToken = config.config.bibliatoken;
  bibliaDefaultToken = config.config.bibliaDefaultToken;
}

app.listen(process.env.PORT || 5000);

app.get('/getverse', function (req, res) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  var text = req.query.text;
  if (text != undefined) {
    console.log(bibliaToken);
    var api = new biblia.Bib(request, bibliaToken, bibliaUrlBuilder);
    api.getVerse(text, function(data) {
      res.send(data);
    });
  }
  else {
    res.send("{\"err\":\"Text parameter not defined in body\"}");
  }
});