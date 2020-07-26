// earthquake data url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// getting data
d3.json(queryUrl, function(data){
   var values = data.features
   console.log(values)
    // Making circles
   var earthquakes = L.geoJSON(values, {
    pointToLayer: function (feature, latlng) {
      return L.circle(latlng, {
          radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          fillOpacity: 0.6,
          color: "black",
          weight: 0.3
      })
    },
    onEachFeature: function (feature, layer){
        layer.bindPopup(`<h3>${feature.properties.place}</h3> <hr> <h3 style="color: red;">Magnitude: ${feature.properties.mag} </h3> <hr> Date: ${new Date(feature.properties.time)}`)
    }
  });
    createMap(earthquakes)
});

// Colors
function getColor(d) { 
    if (d <= 1){
      return "#006400";
    } else if(d <= 2){
      return "#8FBC8F";
    } else if(d <= 3){
      return "#FFD700";
    } else if(d <= 4){
      return "#DAA520";
    } else if(d <= 5){
      return "#FF4500";
    } else {
      return "#FF0000";
    }
} 

// Radius of circles
function getRadius(value){
    return value*60000
}

// Layer map
var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

function createMap(earthquake){
   var baseMaps = {
    "Grayscale": light
};

var mymap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 3,
  layers: [light, earthquake]
});

// Creating legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (mymap) {
    var div = L.DomUtil.create('div', 'info legend'),
        interval = [0, 1, 2, 3, 4, 5];

    for (var i = 0; i < interval.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(interval[i] + 1) + '"></i> ' +
            interval[i] + (interval[i + 1] ? '&ndash;' + interval[i + 1] + '<br>' : '+');
    }
  return div;
};
legend.addTo(mymap);
}