var englishExercises = [];
$(document).ready(function(){

	var pageNumber = 1;
	while(pageNumber <= 16){
		getExercises(pageNumber);
		pageNumber += 1;
	}

	$('#submit-button').click(function(){
		sessionStorage.setItem("zipcode", $("#zipcode").val());
	});
	
	console.log(sessionStorage.getItem("zipcode"));
	getWeather(sessionStorage.getItem("zipcode"));
})
function getWeather(city){
	url = "http://api.openweathermap.org/data/2.5/forecast?q=" + city+",us&mode=json"
	$.getJSON(url, function(responseObject){
		var results = responseObject;
		console.log(results);
		var list = results.list;
		var div = document.getElementById('weather');
		div.innerHTML = div.innerHTML + list[0].weather[0].description + '<br>'
		div.innerHTML = div.innerHTML + '<br>Humidity:' + list[0].main.humidity
		div.innerHTML = div.innerHTML + '<br>Wind Speed (mph):' + list[0].wind.speed
		/*
		//right now this prints all the results (ie lots of data) to be used later
		for(var i in list){
			div.innerHTML = div.innerHTML + list[i].weather[0].description;
    	}*/
	});
}


function getExercises(pageNumber){
	url = "https://wger.de/api/v2/exercise/?page=" + pageNumber + "&format=json"
	$.getJSON(url, function(responseObject){
		var results = responseObject;
		
		var engExercises = results.results.map(function(obj){
			// language 2 is English
			if( obj.language = 2){
				return obj;
			};
		})
		
		$.merge(englishExercises, engExercises);
	});
}