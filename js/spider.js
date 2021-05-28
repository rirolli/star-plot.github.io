// variabili globali
var w = 700;    // width dello spider chart
var h = 700;    // height dello spider chart
var cx = w/2;   // centro sull'asse X del chart
var cy = h/2;   // centro sull'asse Y del chart
var rScale = d3.scaleLinear().range([0,250]);   // inizializzo la scala
var maxValue;   // valore massimo contenuto nel dataset
var minValue;   // valore minimo contenuto nel dataset

// creiamo lo spazio che conterrà il SVG
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// restituisce il valore massimo tra tutti i valori nel file json
function getMaxValue(data){
    let max = 0
    let t_max
    data.forEach(function(e) { 
            t_max = d3.max(Object.values(e));
            if(t_max > max) {
                max = t_max;
            } 
        });
    return max;
}

// restituisce il valore minimo tra tutti i valori nel file json
function getMinValue(data){
    let min = 9999
    let t_min
    data.forEach(function(e) { 
            t_min = d3.min(Object.values(e));
            if(t_min < min) {
                min = t_min;
            } 
        });
    return min;
}

function plotGrid() {
    let equalParts = (maxValue/5).toPrecision(2);
    let ticks = [equalParts, equalParts*2, equalParts*3, equalParts*4, equalParts*5, equalParts*6];
    
    ticks.forEach(function(t) {
        svg.append("circle")
           .attr("cx", cx)
           .attr("cy", cy)
           .attr("fill", "none")
           .attr("stroke", "gray")
           .attr("r", rScale(t));
    });

    ticks.forEach(t =>
        svg.append("text")
        .attr("x", cx+5)
        .attr("y", cy-rScale(t)-1)
        .text(t.toString())
    );
}


// caricamento del file json
d3.json("data/data.json").then(function(data) {
    console.log(data); // log dei dati

    maxValue = getMaxValue(data);   // trovo il valore massimo nel file json
    minValue = getMinValue(data);   // trovo il valore minimo nel file json

    rScale.domain([0,maxValue]);        // Aggiorno il dominio della scale

    plotGrid();
    
}).catch(function(error){});