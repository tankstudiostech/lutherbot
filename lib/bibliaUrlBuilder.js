this.bibliaUrl = 'https://api.biblia.com/v1/bible';

this.getReferenceFromText  = function(text, token) {
	return encodeURI(this.bibliaUrl + '/scan.text?text=' + text + '&key=' + token);
};

this.getPassageFromReference = function(version, reference, token) {
	return encodeURI(this.bibliaUrl + '/content/' + version + '.txt.json?passage=' + reference + '&key=' + token);
};