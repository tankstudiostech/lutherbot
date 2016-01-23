var express = require('express');
var app = express();
var request = require('request');
var moment = require('moment');
var biblia = require('./lib/bibliaApiWrapper');
var bibliaUrlBuilder = require('./lib/bibliaUrlBuilder');
var converter = require('./lib/converter');
var bodyParser = require('body-parser');
var xmljs = require('xml2js');
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

app.get('/timeConvert', function (req, res) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  var convertFrom = req.query.convertFrom;
  var convertTo = req.query.convertTo;
  var time = req.query.time;
  
  if (convertFrom && convertTo && time) {
    var convert = new converter.Converter(moment);
    convert.convertTime(convertFrom, convertTo, time, function(data) {
      res.send(data);
    });
  }
  else {
    res.send("{\"err\":\"Text parameter not defined in body\"}");
  }
});

var techrefurl = 'techreformation.slack.com';
var techreftoken = process.env.slackToken;

app.post('/techrefinvite', function (req, res) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  InviteToSlack(techrefurl, req.body.email, req.body.fname, req.body.lname, techreftoken, res);
});

app.get('/techrefepisodes', function (req, res) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    GetTechRefEpisodeFeed(res);
});

app.get('/techrefmembercount', function (req, res) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    GetTechRefMemberCount(res, techreftoken, techrefurl);
});

function InviteToSlack(url, email, fname, lname, token, originalRes) {
  var options = {
    proxy: process.env.https_proxy,
    url: 'https://' + url + '/api/users.admin.invite?email=' + email + '&channels=C06SGVBV5&first_name=' + fname + '&last_name=' + lname + '&token=' + token + '&set_active=true&_attempts=1',
    method: 'POST',
  };

  request.post(options, function (err, res, body) {
    originalRes.send(body);
  });
}

function GetTechRefEpisodeFeed(origRes) {
    var options = {
        proxy: process.env.https_proxy,
        url: 'http://feeds.feedburner.com/techreformation?format=xml',
        method: 'GET',
    };

    request.get(options, function (err, res, body) {
        xmljs.parseString(body, function(err, result) {
            var items = [];
            var list = result.rss.channel[0].item;
            for(var i in list) {
                var episode = list[i];
                items.push({title: episode.title, date: episode.pubDate, description: episode.description, url: episode['media:content'][0].$.url})
            }
            origRes.send(items);
        });
    });
};

function GetTechRefMemberCount(origRes, token, url) {
    var options = {
        url: 'https://' + url + '/api/users.list?token=' + token +'&presence=1',
        method: 'GET',
    };

    request.get(options, function (err, res, body) {
        var parsed = JSON.parse(body);
        var members = parsed.members;
        members = members.filter(x => {
            return x.id != "USLACKBOT" && !x.is_bot && !x.deleted;
        });
        var total = members.length;
        members = members.filter(x => { return 'active' == x.presence; });
        origRes.send({"total": total, "online": members.length});
    });
};