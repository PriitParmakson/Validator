// cloud/main.js - Parse pilverakenduse pea

// Teave: Lihtne Parse.com Express rakendus:
// http://blog.parse.com/2013/06/04/building-parse-web-apps-with-the-express-web-framework/

// Kuidas see käima läheb? Nime 'main' järgi?

// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// App configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// Enable CORS
// Vt http://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Attach request handlers to routes
// Path and HTTP verb using the Express routing API.
//////////////// NB! Juur
app.get('/', function(req, res) {
  res.render('metaRIAet');
});

// JSON-LD faili sisselugemine
// Vt: https://parse.com/docs/cloud_code_guide#modules
// NB! Loeb sisse failist teenused.js, kasutades muutujat teenused. Nõuab failis JSON-väärtuse ümber ümbrist
var imporditu = require('cloud/teenused');

var teenused = imporditu.teenused;

app.get('/teenused', function(req, res) {
	// res.json - http://stackoverflow.com/questions/10665705/how-do-i-generate-json-with-expressjs-railwayjs-node-js
  res.json(teenused);  // Send a JSON response
});

app.get('/et', function(req, res) {
	res.render('metaRIAet');
});

app.get('/en', function(req, res) {
	res.render('metaRIAen');
});

app.get('/test', function(req, res) {
	res.render('test');
});

// Pilvefunktsioon, mis sisendis antud URL-ilt loeb sisse faili
// ja tagastab selle kliendirakendusse
Parse.Cloud.define("loeFail", function(request, response) {
	var fnimi = request.params.fnimi;
	console.log('** loeFail ' + fnimi);
	Parse.Cloud.httpRequest({
		url: fnimi,
		headers: {
    'Accept': 'text/html,application/json'
		// 'Accept-Language': 'et,et-EE',
		},
		success: function(httpResponse) {
			// httpResponse struktuur vt https://parse.com/docs/cloud_code_guide
			// status, headers, buffer (raw byte representation)
			// text (raw text body)
			// data (the parsed response)
			// cookies
			response.success(httpResponse);
		},
		error: function(httpResponse) {
			// Vt http://parse.com/docs/dotnet/api/html/T_Parse_ParseException_ErrorCode.htm
			console.error('  faili lugemine ebaõnnestus: ' + httpResponse.status);
			response.error('Request failed with response code ' + httpResponse.status);
		}
	});
});

// Attach the Express app to Cloud Code.
app.listen();
