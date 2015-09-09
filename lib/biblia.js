var request = require('request');
var token, defaultToken, bibliaUrl;

if((process.env.heroku || "false") === "true") {
	token = process.env.bibliaToken;
	defaultToken = process.env.bibliaDefaultToken;
	bibliaUrl = process.env.bibliaUrl;
}
else {
	var config = require('../config');
	token = config.config.bibliatoken;
	defaultToken = config.config.bibliaDefaultToken;
	bibliaUrl = config.config.bibliaUrl;
}


this.getVerse = function(text, callback) {
	console.log("Getting Reference from " + text);
	this.getReferenceFromText(text, function(data) {
		var res = JSON.parse(data);
		console.log("Received reference: " + res.results);
		if(res.results.length > 0)
		{
			getTextFromReference(res.results[0].passage, function(newData) {
				console.log("Received reference text: " + newData);
				text = JSON.parse(newData);
				console.log("Received reference text: " + text);
				var sendBack = {
					"ok": true,
					"text": text.text,
					"reference": res.results[0].passage
				}
				console.log("Sending back: " + sendBack.reference + " " + sendBack.text)
				callback(sendBack);
			});
		}
		else
		{
			var err = {
					"ok": false,
					"err": "No reference found"
				
				}
			callback(err);
		}
	});
};

this.getReferenceFromText = function(text, callback) {
	console.log("Inside getReferenceFromText: " + text);
	var url = bibliaUrl + '/scan.text?text=' + text + '&key=' + token;
	
	var options = {
		proxy: process.env.https_proxy,
		url: encodeURI(url),
		method: 'GET'	
	};
	
	console.log("GET to " + url);
	request.get(options, function (err, res, body) {
		console.log("Reference: " + body);
		callback(body);
	});
};

function getTextFromReference(reference, callback) {
	var url = bibliaUrl + '/content/LEB.txt.json?passage=' + reference + '&key=' + token;
	var options = {
		proxy: process.env.https_proxy,
		url: encodeURI(url),
		method: 'GET'	
	};
	
	console.log("GET to " + url);
	request.get(options, function (err, res, body) {
		callback(body);
	});
};