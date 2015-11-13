describe("Converter", function() {
    var timeConverter = require('../lib/converter');
	it("should work", function() {
		var converter = new timeConverter.TimeConverter();
		converter.logMoment();
	});
});