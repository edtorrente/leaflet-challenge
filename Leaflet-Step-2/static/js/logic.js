// build map with satellite, outdoors, dark layers

function createMap(GeoJsonLayer, TekPlatesLayer){
    // Add multiple tile layers
    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    })

    var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    })

    var grayScaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    })

    var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    })
    
    // build basic map object

    var basicMaps = {

        Grayscale: grayScaleMap,
        Outdoors: outdoorsMap,
        Dark: darkMap,
        Satellite: satelliteMap
    }

    // Create an overlayMaps object

    var overlayMaps = {
        'Fault Lines': TekPlatesLayer,
        Earthquakes: GeoJsonLayer
    }
    // build map overlays object

    var myMap = L.map('map',{
        center:[37.0902, -95.7129],
        zoom: 5,
        layers: [satelliteMap, TekPlatesLayer, GeoJsonLayer]
    })
    
    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(basicMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    
    return myMap;
}

// Function for creating GeoJSON layer
function createGeoJsonLayer(data){
    var GeoJsonLayer = L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: circleMagnitude(feature.properties.mag),
                fillColor: circleColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        ForEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    })
    return GeoJsonLayer;
}

// legend

function MyLegend(map)  {
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function(map)   {
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

// link to tectonic plates

var tekPlatesPath = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
d3.json(tekPlatesPath).then(function(platesData){
    var platesLayer = L.geoJson(platesData,{
        style: function(feature) {
            return {
                
                fillColor: "white",
                fillOpacity:0
            };
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<span>Plate: ${feature.properties.PlateName}</span>`)
        }
    })
    
    var usgs_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    d3.json(usgs_url).then(function(quake){
        
        var GeoJsonLayer = createGeoJsonLayer(quake);
        var myMap = createMap(GeoJsonLayer,platesLayer);
        createLegend(myMap)
});
})

