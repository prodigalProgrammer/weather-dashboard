var APIkey = "62aad06d0f51cd8bd14f3a7f60f5f57b";

$("#search-button").on("click", function (event) {
  event.preventDefault();

  //   To ensure search input cannot be blank
  if ($("#search-input").val() === "") {
    $("#intro").text("Please search for a City first.");
  } else {
    $("#intro").attr("class", "hide");
  }

  $("#today").addClass("border");

  var city = $("#search-input").val();
  var weatherURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIkey;

  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
  console.log(weatherURL);
});
