var requestBaseUrl = "https://rickandmortyapi.com/api/";
var locationSuffix = "location/";
var characterSuffix = "character/";
var locations = [];
var pages = -1;
var charactersAmount = 0;
var field = document.querySelector("#field");

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
    charAmountMap.forEach(function (element, index) {
        lines[index] = element*index/minSquare;
    });
    lines[0] = 0.5*lines[1];

    sum = 0;
    startX[0] = 0;
    lines.forEach(function (element, index) {
        startX[index] = sum;
        sum += element;
    });
    minX = 100/sum;
    startX.forEach(function (element, index){
        startX[index] = element*minX;
        lines[index]*= minX;
    });
    locations.forEach(function (element) {
        draw(element);
    });
}


function mouseOver(event){
    var text = event.target;
    var id = text.id.substring(0, text.id.length - 3);
    document.getElementById(id + "box").setAttribute("fill", "red");
}

function mouseOut(event){
    var text = event.target;
    var id = text.id.substring(0, text.id.length - 3);
    document.getElementById(id + "box").setAttribute("fill", "green");
}


function draw(planet) { // planet = locations[i]
    var x = startX[planet.residents.length];
    var height = 100/charAmountMap[planet.residents.length];
    var width = lines[planet.residents.length];
    if (counters[planet.residents.length] === undefined)
        counters[planet.residents.length] = 0;
    var y = counters[planet.residents.length]*height;
    counters[planet.residents.length]++;
    var id = planet.id.toString();

    var group = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    group.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    group.setAttribute("version", "1.1");
    group.setAttribute("viewBox", "0 0 1 1");
    group.setAttribute("preserveAspectRatio", "none");
    group.setAttribute("id", id);
    group.setAttribute("x", x + "%");
    group.setAttribute("y", y + "%");
    group.setAttribute("width", width +"%");
    group.setAttribute("height", height + "%");
    group.addEventListener("mouseover", mouseOver);
    group.addEventListener("mouseout", mouseOut);


    var box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    box.setAttribute("id", id+"box");
    box.setAttribute("x", 0);
    box.setAttribute("y", 0);
    box.setAttribute("width", 100 +"%");
    box.setAttribute("height", 100 + "%");
    box.setAttribute("fill", "green");
    box.setAttribute("stroke", "yellow");
    box.setAttribute("stroke-width", 1.5 + "%");
    console.log("kek");
 //   box.addEventListener("mouseover", rectEvent);
   // box.addEventLis

    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("id", id+"txt");
    text.textContent = planet.residents.length;
    text.setAttribute("fill", "white");

 //   text.addEventListener("mouseover", textEvent);

    var tY = 8;
    var fontSize = 0.5;
    if (charAmountMap[planet.residents.length] > 1){
        fontSize *=1.5;
        tY*= 2;
    }
    if (charAmountMap[planet.residents.length] > 3){
        fontSize *=2;
        tY*= 2;
    }
    if (charAmountMap[planet.residents.length] > 10){
        fontSize *=2;
        tY *= 1.3;
    }

    text.setAttribute("x", 10 + "%");
    text.setAttribute("y", tY + "%");
    text.textLength.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PERCENTAGE, 30);
    text.setAttribute("lengthAdjust", "spacingAndGlyphs");

//    text.setAttribute("font-size", fontSize + "%");
    text.setAttribute("font-family", "Arial");

    group.appendChild(box);
    group.appendChild(text);

    field.appendChild(group);
}

locationsRequest();