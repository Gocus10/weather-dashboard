var cityEl = document.querySelector("#city");
var locationFormEl = document.querySelector("#location-form");
var infoContainerEl = document.querySelector("#info-container");
var searchEl = document.querySelector("#search-history");
function storeLocation(place){
    const locARR = JSON.parse(localStorage.getItem("places")) || [];
    locARR.push(place);
    console.log(locARR);    
    localStorage.setItem("places", JSON.stringify(locARR)); 
    build();
}
function build(){
    searchEl.innerHTML = "";
    
    const Pl = JSON.parse(localStorage.getItem("places"));
    var stuff = document.createElement("ul")
     for(i=0;i<Pl.length;i++){
            var clickme = document.createElement("li")
            clickme.classList = "d-inline col-12"
            clickme.innerHTML = "<button class='d-flex col-12 btn btn-light'>" + Pl[i] + "</button>"
            stuff.appendChild(clickme);
     }
    searchEl.appendChild(stuff);
}
var getWeather = function(location) {
    storeLocation(location);
    // format the api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=0bd635ff0a032a8e60a26d70f81507ea";
    
    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        
        displayWeather(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
    })
    .catch(function(error) {
        
        alert("Unable to connect to open weather map");
    });
};
var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityname = cityEl.value.trim();
    if (cityname) {
    getWeather(cityname);
    } else {
    alert("Please enter a valid location");
    }
};
var displayWeather = function(currentweather) {
    const time = moment().format("M/D/YYYY");
    var uvUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + currentweather.coord.lat + "&lon=" + currentweather.coord.lon + "&appid=0bd635ff0a032a8e60a26d70f81507ea";
    var fiveUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + currentweather.name + "&units=imperial&appid=0bd635ff0a032a8e60a26d70f81507ea";
    infoContainerEl.innerHTML = "";
    fetch(uvUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
          response.json().then(function(currentUV) {
            var dailyEl = document.createElement("div");
            dailyEl.classList = "d-flex";
            
            var dataEl = document.createElement("div");
            dataEl.innerHTML = "<h3 class ='d-inline'>" + currentweather.name + " (" + time + ")" + "</h3><img class='d-inline' src='http://openweathermap.org/img/wn/" + currentweather.weather[0].icon + "@2x.png'</img><br><p class='p-2'>Temperature: " + currentweather.main.temp + " °F</p><br><p class='p-2'>Humidity: " + currentweather.main.humidity + " %</p><br><p class='p-2'>Wind Speed: " + currentweather.wind.speed + " MPH</p><br><p class='d-inline p-2'> UV Index: </p>"
            var uv = document.createElement("p")

            if(currentUV[0].value<3){uv.classList = "d-inline p-2 rounded bg-success"}
            if(currentUV[0].value>3 && currentUV[0].value<6){uv.classList = "d-inline p-2 rounded bg-warning"}
            if(currentUV[0].value>6){uv.classList = "d-inline p-2 rounded bg-danger"}
            
            uv.innerHTML= currentUV[0].value
    
            dataEl.appendChild(uv);
            dailyEl.appendChild(dataEl);

            var fiveDay = document.createElement("div")
            fiveDay.classList = "row"
            fiveDay.innerHTML = "<h4 class='mt-5 col-12'>5-day Forecast:</h4>"
            fetch(fiveUrl)
            .then(function(response) {
                // request was successful
                if (response.ok) {
                  response.json().then(function(fiveData) {
                 for(i=8;i<40;i+=8){
                      var box = document.createElement("div")
                      var forecast = document.createElement("div")
                      forecast.innerHTML = "<p class='font-weight-bold'>" + moment().add((i*3), 'h').format("M/D/YYYY") + "</p><img class='h-50 w-50' src='http://openweathermap.org/img/wn/" + fiveData.list[i].weather[0].icon + "@2x.png'</img><p>Temp: " + fiveData.list[i].main.temp + " °F</p><p class='p-2'>Humidity: " + fiveData.list[i].main.humidity + " %</p>"
                      box.classList = "bg-primary text-light rounded col-2 m-2"
                      box.appendChild(forecast);
                      fiveDay.appendChild(box);
                    }
                });

                } else {
                  alert("Error: " + response.statusText);
                }

                })
                .catch(function(error) {
                    
                    alert("Unable to connect to open weather map");
                });        
            
            
            infoContainerEl.appendChild(dailyEl); 
            infoContainerEl.appendChild(fiveDay);
          });
        } else {
          alert("Error: " + response.statusText);
        }
        })
        .catch(function(error) {
            
            alert("Unable to connect to open weather map");
        });
};
var buttonHandler = function(event){
    getWeather(event.target.innerText);
}
window.addEventListener('load', (event) => {
    if(localStorage.getItem("places")!== null){
    build();}
  });
locationFormEl.addEventListener("submit", formSubmitHandler);
searchEl.addEventListener("click", buttonHandler);
