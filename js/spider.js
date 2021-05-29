// variabili globali
var w = 800;    // width dello spider chart
var h = 800;    // height dello spider chart
var cx = w/2;   // centro sull'asse X del chart
var cy = h/2;   // centro sull'asse Y del chart
var rScale = d3.scaleLinear().range([0,250]);   // inizializzo la scala
var oScale = d3.scaleOrdinal(d3.schemeCategory10);  // colori per i dati
//var oScale = ["#e69a61", "#9817ff", "#18c61a", "#33b4ff", "#c9167e", "#297853", "#d7011b", "#7456c7", "#7e6276", "#afb113", "#fd879c", "#fb78fa", "#24c373", "#45bbc5", "#766b21", "#abad93", "#c19ce3", "#fd8f11", "#2f56ff", "#307a11", "#b3483c", "#0d7396", "#94b665", "#9d4d91", "#b807c8", "#086cbf", "#a2abc5", "#a35702", "#d3084b", "#8c6148", "#fa82ce", "#71be42", "#2bc0a0", "#b64064", "#d09fa2"];  // colori per i dati
var line = d3.line().x(d => d.x).y(d => d.y);   // coordinate del vertice per ogni elemento del dataset
var maxValue;   // valore massimo contenuto nel dataset
var minValue;   // valore minimo contenuto nel dataset
var lenAxis     // lunghezza massima degli assi

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

// creazione delle griglie
function plotGrid() {
    let equalParts = (maxValue/5).toPrecision(2);
    lenAxis = equalParts*6
    let ticks = [equalParts, equalParts*2, equalParts*3, equalParts*4, equalParts*5, lenAxis];
    
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

// Generazione degli assi
function angleToCoordinate(angle, value){
    let x = Math.cos(angle) * rScale(value);
    let y = Math.sin(angle) * rScale(value);
    return {"x": cx + x, "y": cy - y};
}
function showAxis(data) {
    labels = Object.keys(data[0])
    for (var i = 0; i < labels.length; i++) {
        let ft_name = labels[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / labels.length);
        let line_coordinate = angleToCoordinate(angle, lenAxis);
        let label_coordinate = angleToCoordinate(angle, lenAxis+5);

        //draw axis line
        svg.append("line")
           .attr("x1", cx)
           .attr("y1", cy)
           .attr("x2", line_coordinate.x)
           .attr("y2", line_coordinate.y)
           .attr("stroke","black");

        //draw axis label
        svg.append("text")
           .attr("x", label_coordinate.x)
           .attr("y", label_coordinate.y)
           .text(ft_name);
    }
}

// funzione che calcola le coordinate per ogni elemento del file json
function getPathCoordinates(data){
    labels = Object.keys(data);
    let coordinates = [];
    for (var i = 0; i < labels.length; i++){
        let ft_name = labels[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / labels.length);
        coordinates.push(angleToCoordinate(angle, data[ft_name]));
        
    }
    return coordinates;
}

// funzione che genera un colore random
// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//          color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

// funzione che mostra il grafico
function showData(data) {
    for (var i = 0; i < data.length; i ++){
        let d = data[i];
        let color = oScale(JSON.stringify(d));
        let coordinates = getPathCoordinates(d);
        
        //draw the path element
        svg.append("path")
           .datum(coordinates)
           .attr("d",line)
           .attr("stroke-width", 3)
           .attr("stroke", color)
           .attr("fill", color)
           .attr("stroke-opacity", 1)
           .attr("opacity", 0.3)
           .attr("points");

           
    }
}

// funzione che crea una relazione tra i dati e una scala di colori
function mapColors(data) {
    let strValue = [];
    for (let i = 0; i < data.length; i ++){
        strValue.push(String(JSON.stringify(data[i]))); // particolare tipo di hashing 
    }
    oScale.domain(strValue);
}

// caricamento del file json e creazione del grafico
d3.json("data/data.json").then(function(data) {
    console.log(data); // log dei dati

    mapColors(data);                // funzione che crea una relazione tra i dati e una scala di colori

    maxValue = getMaxValue(data);   // trovo il valore massimo nel file json
    minValue = getMinValue(data);   // trovo il valore minimo nel file json

    rScale.domain([0,maxValue]);    // Aggiorno il dominio della scale

    plotGrid();                     // crea le griglie
    showAxis(data);                 // crea gli assi
    
    showData(data)

}).catch(function(error){});