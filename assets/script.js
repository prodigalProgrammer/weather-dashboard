var APIkey = "62aad06d0f51cd8bd14f3a7f60f5f57b";

// When page loads for first time, localStorage would be empty so the function 'getCities' would not work. This circumvents that. Also retrieves localStorage information if present.
var cities = JSON.parse(localStorage.getItem("cities")) || [];
console.log(cities);
// Icon generation for the weather information.
var weatherIcons = {
  Thunderstorm: "⛈",
  Drizzle: "☔",
  Rain: "🌧",
  Snow: "❄️",
  Clear: "☀",
  Clouds: "🌥",
  Fog: "🌫",
  Mist: "🌫",
  Tornado: "🌪",
  Sand: "🏜",
};

function getCities() {
  // When the page loads for the first time, there will be no items in localStorage.
  if (cities === "[]") {
    return;

    // Give each index in 'storedCities' these properties.
  } else {
    for (var storedCity of cities) {
      $("#history").prepend(
        $("<button>")
          .addClass("btn btn-outline-secondary mb-3 stored-city")
          .text(storedCity)
      );
    }
  }
}

// Run function as soon as page loads.
getCities();

$("#history").on("click", ".stored-city", function () {
  var cityStored = $(this).text();
  var storedURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityStored +
    "&appid=" +
    APIkey;

  fetch(storedURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $("#intro").hide();

      // Showing the weather display.
      $("#today").show();
      $("#forecast").show();

      // Clearing the contents for any new entries.
      $("#today")
        .empty()
        .addClass(
          "border border-primary border-start-0 border-end-0 bg-info-subtle"
        );

      // Logic for displaying City information.
      var cityTitle = $("<h2>")
        .addClass("mb-4")
        .text(
          `${cityStored} [${data.city.country}] - ` +
            dayjs().format("DD/MM/YYYY (dddd) ") +
            weatherIcons[data.list[0].weather[0].main]
        );

      // Tenary operator for different population amounts.
      var cityPop = $("<p>").text(
        `Population: ${
          data.city.population >= 1000000
            ? "Over 1 million (MEGA CITY)"
            : data.city.population
        }`
      );
      var temp = $("<p>").text(
        "Temperature: " + (data.list[0].main.temp - 273.15).toFixed(2) + " °C"
      );
      var wind = $("<p>").text("Wind: " + data.list[0].wind.speed + " KPH");
      var humidity = $("<p>").text(
        "Humidity: " + data.list[0].main.humidity + "%"
      );
      $("#today").append(cityTitle, cityPop, temp, wind, humidity);
    });
});

$("#search-button").on("click", function (event) {
  event.preventDefault();

  // Creating variable for search input value.
  var city = $("#search-input").val().trim();

  // Adding 'city' variable to weatherURL request.
  var weatherURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIkey;

  // Fetch Function to get coherent data from response.
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      // Function for testing search input issues.
      function displayIntroMsg(msg) {
        $("#intro").show();
        $("#today").hide();
        $("#forecast").hide();
        $("#intro-text").text(msg);
        $("#intro").removeClass(
          "bg-info bg-opacity-50 border-primary text-primary"
        );
        $("#intro").addClass(
          "bg-warning bg-opacity-75 border-danger text-danger"
        );

        // Clearing search input for next search.
        $("#search-input").val("");
      }

      // Message for blank search input.
      if ($("#search-input").val().trim() === "") {
        displayIntroMsg("Please search for a City first.");

        // Message for invalid city.
      } else if (data.message === "city not found") {
        displayIntroMsg("City not found. Please try again!");

        // Testing for once valid city is entered.
      } else {
        // Hiding intro message.
        $("#intro").hide();

        // Showing the weather display.
        $("#today").show();
        $("#forecast").show();

        // Clearing the contents for any new entries.
        $("#today").empty();

        // City searches get added to '#history' div.
        var historyButton = $("<button>").text(city);
        historyButton.addClass("btn btn-outline-secondary mb-3 stored-city");
        $("#history").prepend(historyButton);

        // Adding a border for a clearly defined section.
        $("#today").addClass(
          "border border-primary border-start-0 border-end-0 bg-info-subtle"
        );

        // Logic for displaying City information.
        var cityTitle = $("<h2>")
          .addClass("mb-4")
          .text(
            `${city} [${data.city.country}] - ` +
              dayjs().format("DD/MM/YYYY (dddd) ") +
              weatherIcons[data.list[0].weather[0].main]
          );

        // Tenary operator for different population amounts.
        var cityPop = $("<p>").text(
          `Population: ${
            data.city.population >= 1000000
              ? "Over 1 million (MEGA CITY)"
              : data.city.population
          }`
        );
        var temp = $("<p>").text(
          "Temperature: " + (data.list[0].main.temp - 273.15).toFixed(2) + " °C"
        );
        var wind = $("<p>").text("Wind: " + data.list[0].wind.speed + " KPH");
        var humidity = $("<p>").text(
          "Humidity: " + data.list[0].main.humidity + "%"
        );
        $("#today").append(cityTitle, cityPop, temp, wind, humidity);

        // Pushing each valid city search into the 'cities' array.
        cities.push(city);

        // Converting all searches into a stringed array and storing in localStorage.
        localStorage.setItem("cities", JSON.stringify(cities));

        // Clearing search input for next search.
        $("#search-input").val("");
      }
    });
});
