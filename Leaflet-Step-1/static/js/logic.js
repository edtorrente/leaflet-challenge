// Create map with U.S> as center
var myMap = L.map('map', {

    center:[41.4790303,-101.9236982], zoom: 6
})

var BasicMap = {"Light Map":lightmap};

// add tile layer to map

var RoadMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{

    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY

}).addTo(myMap);

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});


// add lightmap to tile layers

lightmap.addTo(myMap);

//call the url

var usgs_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//develop a function that will return marker size

function SizeMarker(magnitude) {

    return magnitude * 15000;
}

// this is a function that will add color to circle based on the magnitude of the earthquake

function circleColor(magnitude) {

    if (magnitude <= 1) {
        return '#fed976'
    } else if (magnitude <= 2) {
        return '#feb24c'
    } else if (magnitude <= 3) {
        return '#fd8d3c'
    } else if (magnitude <= 4) {
        return '#fc4e2a'
    } else if (magnitude <= 5) {
        return '#e31a1c'
    } else if (magnitude > 5) {
        return '#b10026'
    } else {
        return '#ffffb2'
    }
}

// this is function to determine radius of circle based on the magnitude of the earthquake

function circleMagnitude(magnitude)  {

    if (magnitude <= 1) {
        return 4
    } else if (magnitude <= 2) {
        return 6
    } else if (magnitude <= 3) {
        return 8
    } else if (magnitude <= 4) {
        return 10
    } else if (magnitude <= 5) {
        return 12
    } else if (magnitude > 5) {
        return 14
    } else {
        return 1
    }
}

// Use d3 to call dataset

d3.json(usgs_url).then(function(data){

    L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
            // Create a circle marker
            return L.circleMarker(latlng, {
                radius: circleMagnitude(feature.properties.mag), // different radius for different magnitude
                fillColor: circleColor(feature.properties.mag), // different circle colors for different magnitude
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    }).addTo(myMap);

// legend
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function()   {
        var div = L.DomUtil.create("div", "legend");
        var limits = [
            '0-1',
            '1-2',
            '2-3',
            '3-4',
            '4-5',
            '> 5'
        ];
        var colors = [
                '#fed976',
                '#feb24c',
                '#fd8d3c',
                '#fc4e2a',
                '#e31a1c',
                '#b10026'
        ];
        var legendInfo = "<h3>Earthquake Magnitude</h3>" //legend
        div.innerHTML = legendInfo;

        for (var i=0; i < limits.length; i++)  {
                div.innerHTML +=
                    '<i style="background:' + (colors[i] + '"></i>' + limits[i] +'<br>');
        }
        return  div;

    };
    legend.addTo(myMap)
});    