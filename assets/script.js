var APIkey = "62aad06d0f51cd8bd14f3a7f60f5f57b";

$("#search-button").on("click", function (event) {
  event.preventDefault();

  // Creating variable for search input value.
  var city = $("#search-input").val();

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
        $("#intro-text").text(msg);
        $("#intro").removeClass(
          "bg-info bg-opacity-50 border-primary text-primary"
        );
        $("#intro").addClass(
          "bg-warning bg-opacity-75 border-danger text-danger"
        );
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

        // City searches get added to 'list-group' div.
        var historyButton = $("<button>").text(city);
        historyButton.addClass("btn btn-outline-secondary mb-3 historyB");
        $("#history").prepend(historyButton);

        // Adding a border for a clearly defined section.
        $("#today").addClass(
          "border border-primary border-start-0 border-end-0 bg-info-subtle"
        );

        // Logic for displaying City information.
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
        var cityTitle = $("<h2>")
          .addClass("mb-4")
          .text(
            `${city} - ` +
              dayjs().format("DD/MM/YYYY (dddd) ") +
              weatherIcons[data.list[0].weather[0].main]
          );

        // Tenary operator for different population amounts.
        var cityPop = $("<p>").text(
          `Population: ${
            data.city.population == "1000000"
              ? "Over 1 million"
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
      }
    });
  console.log(weatherURL);
});
