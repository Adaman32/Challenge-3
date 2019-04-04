var date1 = new Date();

	//displaying date
	
	var dayOfWeek = date1.getUTCDay();
	var day = date1.getUTCDate();
	var month = date1.getUTCMonth();
	var year = date1.getUTCFullYear();

	var weekNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	// making sure that with first second and third - st, nd and rd are displayed instead of th
	if(day>3){
	document.getElementById('date').innerHTML = weekNames[dayOfWeek] + ', ' + day + 'th of ' + 
		monthNames[month] + ' ' + year;
	}
	else if(day==1 || day==21 || day == 31){
		document.getElementById('date').innerHTML = weekNames[dayOfWeek] + ', ' + day + 'st of '+ monthNames[month] + ' ' + year;
	}	
	else if(day==2 || day==22){
		document.getElementById('date').innerHTML = weekNames[dayOfWeek] + ', ' + day + 'nd of ' + monthNames[month] + ' ' + year;
	}	
	else if(day==3 || day==23){
		document.getElementById('date').innerHTML = weekNames[dayOfWeek] + ', ' + day + 'rd of ' + monthNames[month] + ' ' + year;
	}

function getAPIdata() {
	// gather data

	var latitude = document.getElementById("latitude").value;
	var longitude = document.getElementById("longitude").value;

	// creating url and apiKey of the map
	var url = 'https://open.mapquestapi.com/staticmap/v4/getmap?key='
	var apiKey = 'bcmv73EjuMc6bUyoC1yGPeGFKIJaLqMu'

	// adding the latitude and longitude to both maps
	var image1 = url + apiKey + "&size=600,600&zoom=12&type=hyb&scalebar=false&center="+latitude+","+longitude;
	var image2 = url + apiKey + "&size=600,600&zoom=18&type=sat&scalebar=false&center="+latitude+","+longitude;

	// displaying the maps in the html
	document.getElementById('landingSiteBig').innerHTML="<img src=\'"+image1+"\'><figcaption>Landing Area - Larger Overview</figcaption>";
	document.getElementById('landingSiteDetail').innerHTML="<img src=\'"+image2+"\'><figcaption>Detail of Landing Site (if available)</figcaption>";

	// getting Weather url and apiKey
	var urlWeather = "https://api.openweathermap.org/data/2.5/weather";
	var apiKeyWeather = "00f4e138276846aa542ba7a053b507c6";

	//constructing request
	var request = urlWeather + "?appid=" + apiKeyWeather + "&lat=" + latitude + "&lon=" + longitude;

	//fetching AJAX call
	fetch(request)

	.then(function(response) {
		if(!response.ok) throw Error(response.statusText);
		return response.json();
	})

	.then(function(response) {
		// render weatherCondition
		onAPIWeatherSuccess(response);	
	})
	
	// catch error
	.catch(function (error) {
		onAPIError(error);
	});
}

function onAPIWeatherSuccess(response) {
	// get current weather description
	var description = response.weather[0].description;

	// get temperature in Celcius
	var temperature = Math.floor(response.main.temp - 273.15);

	// get pressure in hPA
	var pressure = response.main.pressure;

	// get wind Speed (meter/sec)
	var windSpeed = response.wind.speed;
	
	// get country code
	var country = response.sys.country;

	var name = response.name;

	var icon = document.getElementById('weatherIcon');

	// determining the weather icon
	switch(response.weather[0].main){
		case 'Clear' || 'Drizzle':
			icon.innerHTML = "<img src=\"images/sun.png\">";
			break;
		case 'Clouds':
			icon.innerHTML = "<img src=\"images/cloud.png\">";
			break;
		case 'Rain':
		case 'Drizzle':
			icon.innerHTML = "<img src=\"images/rain.png\">";
			break;
		case 'Thunderstorm':
			icon.innerHTML = "<img src=\"images/thunder.png\">";
			break;
		case 'Snow':
			icon.innerHTML = "<img src=\"images/snow.png\">";
			break;
		// case 'Mist':
		// case 'Smoke':
		// case 'Haze':
		// case 'Dust':
		// case 'Fog':
		// case 'Sand':
		// case 'Ash':
		// case 'Squall':
		// case 'Tornado':
		default:
			icon.innerHTML = "<img src=\"images/mist.png\">";
			break;
	}

	// render weather in DOM
	var weather = document.getElementById('weather');
	weather.innerHTML = "Temperature: " + temperature 
	+ "&#176;C <br> <br>Weather: " + description
	+ "<br> <br>Pressure: " + pressure + " hPa <br>" 
	+ "<br>Wind Speed: " + windSpeed + " Meter/Sec <br>"
	+ "<br>Country, Place: " + country +", " + name;
}

function onAPIError(error) {
	console.error('Fetch request failed', error);
	var weather = document.getElementById('weather');
	weather.innerHTML = 'No weather data available'; 
}

//display the picture of selected latitude and longitude with a GSAP animation
document.getElementById("confirm").onclick = function(){

	var content = document.getElementById('content');
	content.style.opacity = 0;

	TweenMax.to(content, 3, {opacity: 1, ease: Power0.easeInOut});

	getAPIdata();
};
