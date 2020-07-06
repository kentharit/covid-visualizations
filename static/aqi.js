var key = "28b76057-00b8-4fd0-b3a2-8dec32ad5459"
var city = "Bangkok";
var country = "Thailand";
var aqi;
var settings = {
  "url": "api.airvisual.com/v2/city?city="+city+"&country="+country+"&key="+key,
  "method": "GET",
  "timeout": 0,
};

function loadCurrentAqi() {
	$.ajax(settings).done(function (response) {
	// console.
	aqi = response['data']['current']['pollution']['aqius'];
	console.log(response);
	console.log(aqi);
	});
}

loadCurrentAqi();
