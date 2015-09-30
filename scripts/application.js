var englishExercises = [];
var equipmentList;
var exerciseCategory;

$(document).ready(function(){
	var pageNumber = 1;
	while(pageNumber <= 16){
		getExercises(pageNumber);
		pageNumber += 1;
	}

	getWeather(sessionStorage.getItem("zipcode"));
	getEquipmentList();
	getExerciseCategory();

	$('#submit-button').click(function(){
		sessionStorage.setItem("zipcode", $("#zipcode").val());
	});
})

function getWeather(city){
	// use forecast to get 5 day forecast
	// problem: it starts from midnight, so will have to create some filtering mechanism
	url = "http://api.openweathermap.org/data/2.5/weather?q=" + city+",us&units=imperial&mode=json"
	$.getJSON(url, function(responseObject){
		var results = responseObject;
		showWeather(results);
	});
}

var weather;
function showWeather(weatherObj){
	// will have to be readjusted when we change weather to forecast
	weather = weatherObj;
	$('#cityName').text(weatherObj.name);
	$('#low').text(weatherObj.main.temp_min);
	$('#high').text(weatherObj.main.temp_max);
	$('#now').text(weatherObj.main.temp);
	$('#current_weather').text(weatherObj.weather[0].main);
	var icon_url = "http://openweathermap.org/img/w/" + weatherObj.weather[0].icon + ".png"
	$('#cityName').prepend("<img src=" + icon_url + ">");
}
// =======
// 		var list = results.list;
// 		var div = document.getElementById('weather');
// 		div.innerHTML = div.innerHTML + list[0].weather[0].description + '<br>'
// 		div.innerHTML = div.innerHTML + '<br>Humidity:' + list[0].main.humidity
// 		div.innerHTML = div.innerHTML + '<br>Wind Speed (mph):' + list[0].wind.speed
// 		/*
// 		//right now this prints all the results (ie lots of data) to be used later
// 		for(var i in list){
// 			div.innerHTML = div.innerHTML + list[i].weather[0].description;
//     	}*/
// 	});
// }


function getExercises(pageNumber){
	url = "https://wger.de/api/v2/exercise/?page=" + pageNumber + "&format=json"
	$.getJSON(url, function(responseObject){
		var results = responseObject;
		
		var engExercises = results.results.map(function(obj){
			// language 2 is English
			if( obj.language == 2){
				return obj;
			};
		})
		$.merge(englishExercises, engExercises);
		englishExercises = englishExercises.clean(null);
	});
}

function getEquipmentList(){
	url = "https://wger.de/api/v2/equipment/?format=json"
	$.getJSON(url, function(responseObject){
		// responseObject also contains a count for the number of objects in the list
		equipmentList = responseObject.results;
	});
}

function getExerciseCategory(){
	url = "https://wger.de/api/v2/exercisecategory/?format=json"
	$.getJSON(url, function(responseObject){
		// responseObject also contains a count for the number of objects in the list
		exerciseCategory = responseObject.results;
		addCategoriesToResultPage();
	});

}

function addCategoriesToResultPage(){
	var displayText = "";
	for (var i = 0; i < exerciseCategory.length; i++){
		var categoryName =  exerciseCategory[i].name;
		displayText += "<div id=" + categoryName + "><h4>"+categoryName+"</h4><div class='proposed_exercise'"+pickRandomExercise(exerciseCategory[i].id) + "</div></div>"
	}
	$('#exercise_proposals').html(displayText);	
}

function pickRandomExercise(exerciseCategoryID){
	console.log(exerciseCategoryID);
	var exercisesInCategory = englishExercises.map(function(obj){
		return (obj.category == exerciseCategoryID ? obj : null);
	});
	exercisesInCategory = exercisesInCategory.clean(null);
	
	if (exercisesInCategory.length < 1){
		return "No exercises available at this time."
	}
	else{
		var randNum = Math.floor((Math.random() * exercisesInCategory.length));
		var result = displayExerciseObj(exercisesInCategory[randNum]);
		return (result);
	}	
}

function displayExerciseObj(exercise){
	var displayText = "";
	displayText += "<h5>" + exercise.name + "</h5>";
	displayText += "<p>" + exercise.description + "</p>";
	return displayText;
}

// Code Credit: http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};