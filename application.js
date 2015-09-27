var englishExercises = [];
$(document).ready(function(){
	var pageNumber = 1;
	while(pageNumber <= 16){
		getExercises(pageNumber);
		pageNumber += 1;
	}
	getWeather("pittsburgh");
})
function getWeather(city){
	url = "http://api.openweathermap.org/data/2.5/forecast?q=" + city+",us&mode=json"
	$.getJSON(url, function(responseObject){
		var results = responseObject;
		console.log(results);
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