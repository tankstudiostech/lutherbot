this.Bib = function(requestModule, bibliaToken, bibliaUrlBuilder) {
	this.request = requestModule;
	this.token = bibliaToken;
	this.urlBuilder = bibliaUrlBuilder;
	
	this.getVerse = function(text, callback) {
		var parentScope = this;
		
		this.getReferenceFromText(text, function(data) {
			var res = JSON.parse(data);
			if(res.results.length > 0)
			{
				parentScope.getPassageFromReference(res.results[0].passage, function(newData) {
					text = JSON.parse(newData);
					var sendBack = {
						"ok": true,
						"text": text.text,
						"reference": res.results[0].passage
					}
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
		
		var options = {
			url: bibliaUrlBuilder.getReferenceFromText(text, this.token),
			method: 'GET'	
		};
		
		console.log(options.url);
		this.request.get(options, function (err, res, body) {
			console.log(body);
			callback(body);
		});
	};
	
	this.getPassageFromReference = function(reference, callback) {
		var options = {
			url: bibliaUrlBuilder.getPassageFromReference("LEB", reference, this.token),
			method: 'GET'	
		};
		
		this.request.get(options, function (err, res, body) {
			callback(body);
		});
	};
}