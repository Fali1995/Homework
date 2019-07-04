function getColor(mag) {
  return mag > 5 ? '#ff3019' :
        mag > 4  ? '#ff6a19' :
        mag > 3  ? '#ff9419' :
        mag > 2  ? '#ffb619' :
        mag > 1   ? '#ddff19' :
                  '#8cff19';
}


var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(mag) {
  return mag * 10000;
}


var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

d3.json(queryUrl, function(data) {
  var earthquakes = data.features;



  for (var i = 0; i < earthquakes.length; i++) {
    coord = [earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]]
    console.log(coord);
  
     L.circle(coord, {
      fillOpacity: 1,
      color: "black",
      weight: 1,
      fillColor: getColor(earthquakes[i].properties.mag),
      radius: markerSize(earthquakes[i].properties.mag)
    }).addTo(myMap);
  }
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);