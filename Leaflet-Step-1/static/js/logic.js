// earthquake data url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// get earthquake data:
d3.json(queryUrl, function(data){
   var quakeFeatures = data.features
   console.log(quakeFeatures)
    // earthquakes circle markers 
   var earthquakes = L.geoJSON(quakeFeatures, {
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng, 
          {radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          fillOpacity: .75,
          color: "white",
          weight: 1

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

// function to get the radius for circle markers
function getRadius(value){
    return value*60000
}
// Define streetmap
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoid2Vpc3VpIiwiYSI6ImNqaDFhaHF1OTAwdGEyeXFoeDAyamczZW0ifQ.TAcEPXoBGJM1lS1eL7teYw");
// satelliteMap: has to insert id
var satelliteMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  id: 'mapbox.satellite',
  accessToken: 'pk.eyJ1Ijoid2Vpc3VpIiwiYSI6ImNqaDFhaHF1OTAwdGEyeXFoeDAyamczZW0ifQ.TAcEPXoBGJM1lS1eL7teYw'
});

// light map
var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

function createMap(earthquake){
   var baseMaps = {
    "Outdoor Map": streetmap,
    "Grayscale Map": light,
    "Satelite Map": satelliteMap
};

var overlayMaps = {
    "Earthquakes": earthquake    
  };
// create mymap
  var mymap = L.map('map', {
    // center: [40.7128, -74.0060], //nyc coordinate
    maxzoom: 0,
    minZoom: 0,
    layers: [light, earthquake],
    scrollWheelZoom: false  //diable scroll and zoom in the map
  }); 
  mymap.setView([40.7128, -74.0060], 3); //nyc coordinates, zoom level 3

// create legend for circle marker colors
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (mymap) {

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

legend.addTo(mymap);

L.control.layers(baseMaps, overlayMaps).addTo(mymap);
}