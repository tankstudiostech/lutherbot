var request = require('request');

var token = 'af3e9dd726db10140bb80cedd99863f8';
var defaultToken = 'fd37d8f28e95d3be8cb4fbc37e15e18e';
var bibliaUrl = "https://api.biblia.com/v1/bible";

this.getVerse = function(text, callback) {
	console.log("Getting Reference from " + text);
	this.getReferenceFromText(text, function(data) {
		var res = JSON.parse(data);
		console.log("Received reference: " + res.results);
		if(res.results.length > 0)
		{
			getTextFromReference(res.results[0].passage, function(newData) {
				text = JSON.parse(newData);
				var sendBack = {
					"text": text.text,
					"reference": res.results[0].passage
				}
				console.log("Sending back: " + sendBack.reference + " " + sendBack.text)
				callback(sendBack);
			});
		}
		else
		{
			callback("");
		}
	});
};

this.getReferenceFromText = function(text, callback) {
	console.log("Inside getReferenceFromText: " + text);
	var url = bibliaUrl + '/scan.text?text=' + text + '&key=' + token;
	
	var options = {
		proxy: process.env.https_proxy,
		url: url,
		method: 'GET'	
	};
	
	console.log("GET to " + url);
	request.get(options, function (err, res, body) {
		callback(body);
	});
};

function getTextFromReference(reference, callback) {
	var url = bibliaUrl + '/content/LEB.txt.json?passage=' + reference + '&key=' + token;
	var options = {
		proxy: process.env.https_proxy,
		url: url,
		method: 'GET'	
	};
	
	console.log("GET to " + url);
	request.get(options, function (err, res, body) {
		callback(body);
	});
};