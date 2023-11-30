//store the URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Add a Leaflet tile layer.
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create map object
var myMap = L.map("map", {
    center: [50, -100],
    zoom: 3,
    layers: [streets]
});



let baseMaps = {
    "streets": streets
};

// Define Earthquake data and Tectonic plates as layergroups
let earthquake_data = new L.LayerGroup();
let tectonic_plates = new L.LayerGroup();


let overlays = {
    "Earthquakes": earthquake_data,
    "Tectonic Plates": tectonic_plates
};

//Control Layer
L.control.layers(baseMaps, overlays).addTo(myMap);

//Style earthquake Points
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag)
    }
};

//Fills color based on depth
function chooseColor(depth) {
    if (depth <= 10) return "blue";
    else if (depth > 10 & depth <= 25) return "yellow";
    else if (depth > 25 & depth <= 40) return "organge";
    else if (depth > 40 & depth <= 55) return "pink";
    else if (depth > 55 & depth <= 70) return "red";
    else return "green";
};

//Determine radius
function chooseRadius(magnitude) {
    return magnitude*5;
};




d3.json(url).then(function (data) { 
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {  
            return L.circleMarker(latlon).bindPopup(feature.id); 
        },
        style: styleInfo 
    }).addTo(earthquake_data); 
    earthquake_data.addTo(myMap);

    //plate data
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) { 
        L.geoJson(data, {
            color: "purple",  
            weight: 3
        }).addTo(tectonic_plates); 
        tectonic_plates.addTo(myMap);
    });


});
//Create Legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Depth Color Legend</h4>";
       div.innerHTML += '<i style="background: blue"></i><span>(Depth < 10)</span><br>';
       div.innerHTML += '<i style="background: yellow"></i><span>(10 < Depth <= 25)</span><br>';
       div.innerHTML += '<i style="background: orange"></i><span>(25 < Depth <= 40)</span><br>';
       div.innerHTML += '<i style="background: pink"></i><span>(40 < Depth <= 55)</span><br>';
       div.innerHTML += '<i style="background: red"></i><span>(55 < Depth <= 70)</span><br>';
       div.innerHTML += '<i style="background: green"></i><span>(Depth > 70)</span><br>';
  
    return div;
  };
  
  legend.addTo(myMap);


//Data
d3.json(url).then(function (data) {
    console.log(data);
    let features = data.features;
    console.log(features);

    let results = features.filter(id => id.id == "nc73872510"); 
    let result_1 = results[0];
    console.log(result_1);
    let geometry = result_1.geometry;
    console.log(geometry);
    let coords = geometry.coords;
    console.log(coords);
    console.log(coords[0]); // longitude
    console.log(coords[1]); // latitude
    console.log(coords[2]); // depth of earthquake
    let magnitude = result_1.properties.mag;
    console.log(magnitude);
  
    let depth = geometry.coords[2];
    console.log(depth);
    let id = result_1.id;
    console.log(id);

});
