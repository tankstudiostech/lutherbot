describe("Biblia", function() {
  describe("URL Builder", function() {
    var builder = require('../lib/bibliaUrlBuilder');
    
    it("should build reference from text url", function() {
      var url = builder.getReferenceFromText("text", "token token");
      var expectedUrl = 'https://api.biblia.com/v1/bible/scan.text?text=text&key=token%20token';
      expect(url).toEqual(expectedUrl);      
    });
    
    it("should build passage from reference url", function() {
      var url = builder.getPassageFromReference("LEB", "text", "token token");
      var expectedUrl = 'https://api.biblia.com/v1/bible/content/LEB.txt.json?passage=text&key=token%20token';
      expect(url).toEqual(expectedUrl);      
    });
  });
  
  describe("API Wrapper", function() {
    var biblia = require('../lib/bibliaApiWrapper');
    var urlBuilder = {
        getReferenceFromText: function (text, token) {
          return text + token;
        },
        getPassageFromReference: function (version, reference, token) {
          return version + reference + token;
        }
      };

    it("should get a verse from text", function() {
      var text = "John 3:16";
      var token = "token";
      
      var request =  {
        get: function(options, callback) {
          if(options.url === "LEBreferencetoken") {
            callback({}, {}, '{"text": "rawr"}');
          }
          else {
            callback({}, {}, "{\"results\": [{\"passage\": \"reference\"}]}");
          }
        }
      };
      
      bib = new biblia.Bib(request, token, urlBuilder);
      bib.getVerse(text, function(data) {
        expect(data.ok).toEqual(true);
        expect(data.text).toEqual('rawr');
        expect(data.reference).toEqual('reference');
      });
    });
    
    it("should get give err when no verse found", function() {
      var text = "John 3:16";
      var token = "token";
      
      var request =  {
        get: function(options, callback) {
          if(options.url === "LEBreferencetoken") {
            callback({}, {}, '{"text": "rawr"}');
          }
          else {
            callback({}, {}, "{\"results\": []}");
          }
        }
      };
      
      bib = new biblia.Bib(request, token, urlBuilder);
      bib.getVerse(text, function(data) {
        expect(data.ok).toEqual(false);
        expect(data.err).toEqual('No reference found');
      });
    });
    
    it("should get passage from a reference", function() {
      var reference = "reference";
      var token = "token";
      var version = "LEB";
      var requestResponse = "yay";
      
      var request =  {
        get: function(options, callback) {
          expect(options.url).toEqual(version + reference + token);
          callback({}, {}, requestResponse);
        }
      };
      
      bib = new biblia.Bib(request, token, urlBuilder);
      bib.getPassageFromReference(reference, function(data) {
        expect(data).toEqual(requestResponse);
      });
    });
  });
  
});
