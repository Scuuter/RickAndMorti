var requestBaseUrl = "https://rickandmortyapi.com/api/";
var locationSuffix = "location/";
var characterSuffix = "character/";
var locations = [];
var pages = -1;
var charactersAmount = 0;
var locationsReady = false;
var parametersReady = false;
var field = document.querySelector("#field");
var baseRect;

function Planet(id, name, type, dimension, people) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.dimension = dimension;
    this.people = people;
}


function request(url, func) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.responseType = "json";
    req.send();

    req.onload = function () {
        var json = req.response;
        func(json);
    };
}

function locationsRequest() {
    request(requestBaseUrl + locationSuffix, function (json) {
        pages = json['info']['pages'];
        initLocations(json, 1);
    });
}

function initLocations(json, i) {
    for (var j = 0; j < json['results'].length; j++) {
        locations.push(json['results'][j]);
    }

    if (i < pages) {
        request(json['info']['next'], function (next) {
            initLocations(next, i + 1);
        })
    }
    if (i === pages) {
        charAmountRequest();
    }
}

function charAmountRequest() {
    request(requestBaseUrl + characterSuffix, function (json) {
        charactersAmount = json['info']['count'];
        initParameters();
    });
}

var minSquare = charactersAmount + 1000, minX, sum;
var lines = [], startX = [], charAmountMap = [], counters = [];

function initParameters() {
    console.log(locations[0]);
    for (var i = 0; i < locations.length; i++) {
        if (charAmountMap[locations[i].residents.length] === undefined)
            charAmountMap[locations[i].residents.length] = 0;
        charAmountMap[locations[i].residents.length]++;
    }
    charAmountMap.forEach(function (element, index)
     {
         if (element * index !== 0) {
             if (element * index < minSquare) {
                 minSquare = element * index;
             }
         }
    });
 //   console.log(minSquare);
    charAmountMap.forEach(function (element, index) {
        lines[index] = element*index/minSquare;
//        console.log(element);
    });
    lines[0] = 0.5*lines[1];

    sum = 0;
    startX[0] = 0;
    lines.forEach(function (element, index) {
        startX[index] = sum;
        sum += element;
 //       console.log(element);
    });
    minX = 100/sum;
    startX.forEach(function (element, index){
        startX[index] = element*minX;
        lines[index]*= minX;
//        console.log(element);
    });
    locations.forEach(function (element) {
        draw(element);
    });
}

function draw(planet) { // planet = locations[i]
    var x = startX[planet.residents.length];
    var height = 100/charAmountMap[planet.residents.length];
    var width = lines[planet.residents.length];
    if (counters[planet.residents.length] === undefined)
        counters[planet.residents.length] = 0;
    var y = counters[planet.residents.length]*height;
    counters[planet.residents.length]++;

    var box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    box.setAttribute("x", x + "%");
    box.setAttribute("y", y + "%");
    box.setAttribute("width", width +"%");
    box.setAttribute("height", height + "%");
    box.setAttribute("fill", "green");
    box.setAttribute("stroke", "yellow");
    box.setAttribute("stroke-width", width*0.009 + "%");

    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = planet.residents.length;
    text.setAttribute("fill", "white");
    text.setAttribute("x", x + 0.1*width + "%");
    text.setAttribute("y", y + 0.3*height + "%");


    var fontSize = 0.01*height;
    if (width * 3 < height) {
        fontSize = 0.03 * width;
        text.setAttribute("y", y + 0.09*height+ "%");
    }

    if (planet.residents.length === 0){
        fontSize *= 1.2;                // without it 0 are not printed
    }
    text.setAttribute("font-size", fontSize + "%");
 //   text.setAttribute("length", 0.9*width + "%");

    field.appendChild(box);
    field.appendChild(text);

}

locationsRequest();


/*var box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        box.setAttribute("x", "50%");
        box.setAttribute("y", "30%");
        box.setAttribute("width", "20%");
        box.setAttribute("height", "10%");
        box.setAttribute("fill", "blue");
        field.appendChild(box);*/