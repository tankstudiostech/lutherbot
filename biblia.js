var request = require('request');

var token = 'af3e9dd726db10140bb80cedd99863f8';
var bibliaUrl = "https://api.biblia.com/v1/bible";

this.getVerse = function(text, callback) {
	console.log("Getting Reference from " + text);
	this.getReferenceFromText(text, function(reference) {
		callback(reference);
	});
};

this.getReferenceFromText = function(text, callback) {
	console.log("Inside getReferenceFromText: " + text);
	var url = bibliaUrl + '/scan.js?text=' + text + '&key=' + token;
	
	var options = {
		proxy: process.env.https_proxy,
		url: url,
		method: 'GET'	
	};
	
	console.log("Posting to " + url);
	request.post(options, function (err, res, body) {
		callback(body);
	});
}