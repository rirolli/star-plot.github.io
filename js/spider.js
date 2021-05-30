// variabili globali
var data;       // dati in ingresso dal file json
var w = 800;    // width dello spider chart
var h = 800;    // height dello spider chart
var cx = w/2;   // centro sull'asse X del chart
var cy = h/2;   // centro sull'asse Y del chart
var radius = 5;      // raggio dei points
var rScale = d3.scaleLinear().range([0,250]);           // inizializzo la scala
var inverseRScalse = d3.scaleLinear().domain([0,250]);  // scala inversa per ottenere i punti originali
var oScale = d3.scaleOrdinal(d3.schemeCategory10);  // colori per i dati
var maxValue;   // valore massimo contenuto nel dataset
var minValue;   // valore minimo contenuto nel dataset
var lenAxis     // lunghezza massima degli assi
var updateTime = 500


/* ### FUNZIONI DI AUSILIO ### */

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

// funzione che crea una relazione tra i dati e una scala di colori
function mapColors(data) {
    let strValue = [];
    for (let i = 0; i < data.length; i ++){
        strValue.push(String(JSON.stringify(data[i]))); // particolare tipo di hashing 
    }
    oScale.domain(strValue);
}

/* ### CALCOLO COORDINATE ### */
// funzione che calcola le coordinate per ogni elemento del file json
function getPathCoordinates(data){
    labels = Object.keys(data);
    let coordinates = [];
    for (var i = 0; i < labels.length; i++){
        let ft_name = labels[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / labels.length);
        let pos = angleToCoordinate(angle, data[ft_name]);
        coordinates.push(pos);
    }
    return coordinates;
}


// calcolo del punto sugli assi
function getPointAxis(x, y) {
    return Math.sqrt(Math.pow(x,2)+Math.pow(y,2))
}

/* ### ANIMAZIONI ### */

// Evento focus del mouse sul punto
function handleMouseOver(d, i) {
    let idPoint = "#"+d3.select(this).attr('id');   // id gruppo di punti
    let pointCX = d3.select(this).attr("cx");       // posizione su asse X punto in focus
    let pointCY = d3.select(this).attr("cy");       // posizione su asse Y punto in focus

    // Selezione del gruppo di punti appartenenti allo stesso poligono
    d3.selectAll(idPoint)
        .attr("r", radius * 2);

    // Aggiunta della label dei punti degli assi
    svg.append("text")
        .attr("id", "label")
        .attr("x", function() { return pointCX - 30; })
        .attr("y", function() { return pointCY - 15; })
        .text(function() {return inverseRScalse(getPointAxis((cx - pointCX), (cy - pointCY))).toPrecision(4); });
  }

// Evento quando mouse va via dal punto
function handleMouseOut(d, i) {
    let idGroupPoint = "#"+d3.select(this).attr('id');
    let idPoint = "#label";

    // Selezione del gruppo di punti appartenenti allo stesso poligono
    d3.selectAll(idGroupPoint)
        .attr("r", radius);

    // Rimozione della label
    d3.select(idPoint).remove();
  }

/* ### GRAFICO ### */

// import dei dati dal file json
d3.json("data/data.json").then(function(d) {
    console.log(d);                 // log dei dati
    data = d;                       // imposto la variabile globare data uguale al file json appena letto
    mapColors(d);                   // funzione che crea una relazione tra i dati e una scala di colori
    maxValue = getMaxValue(d);      // trovo il valore massimo nel file json
    minValue = getMinValue(d);      // trovo il valore minimo nel file json
    rScale.domain([0,maxValue]);    // Aggiorno il dominio della scale
    inverseRScalse.range([0,maxValue]); // aggiurno il range della scala inversa di rScale
    showData(d);                    // mostra il grafico
}).catch(function(error){
    console.log(error)              // log in caso di errore
});

// Creazione del canvas SVG
var svg = d3.select("body")
    .append("svg")
    .attr("height", h)
    .attr("width", w);

// Creazione delle griglie del grafico
function plotGrid() {
    let equalParts = (maxValue/5).toPrecision(2);
    lenAxis = equalParts*6
    let ticks = [equalParts, equalParts*2, equalParts*3, equalParts*4, equalParts*5, lenAxis];
    
    // griglie
    let circle = svg.selectAll("circle")
        .data(ticks);

    circle.exit().remove(); // exit

    circle.enter()  // enter
        .append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .transition().duration(1000)
        .attr("r", t=>rScale(t));

    // scritte
    let txt = svg.selectAll(".tick")
        .data(ticks);
    
    txt.exit().remove();    //exit

    txt.enter() //enter
        .append("text")
        .attr("class", "tick")
        .attr("x", cx+5)
        .attr("y", t=>cy-rScale(t)-1)
        .transition().duration(1000).delay(1000)
        .attr("opacity", 1)
        .text(t=>t.toString());
}


// Generazione degli assi
function angleToCoordinate(angle, value){
    let x = Math.cos(angle) * rScale(value);
    let y = Math.sin(angle) * rScale(value);
    return {"x": cx + x, "y": cy - y};
}
function showAxis(data) {
    plotGrid()  // plot delle griglie

    let line_coordinate = []
    let label_coordinate = []

    labels = Object.keys(data[0])
    for (var i = 0; i < labels.length; i++) {
        let ft_name = labels[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / labels.length);
        line_coordinate.push(angleToCoordinate(angle, lenAxis));
        label_coordinate.push(angleToCoordinate(angle, lenAxis+10));

        //disegna le linee degli assi
        let axis = svg.selectAll("line")
            .data(line_coordinate);

        axis.exit().remove();   // exit

        axis.enter()    // enter
            .append("line")
            .attr("x1", cx)
            .attr("y1", cy)
            .attr("x2", l=>l.x)
            .attr("y2", l=>l.y)
            .transition().duration(1000).delay(1000)
            .attr("opacity", 1)
            .attr("stroke","black");

        //disegna le label degli assi
        let axis_label = svg.selectAll(".label")
            .data(label_coordinate);

        axis_label.exit().remove();

        axis_label.enter()
            .append("text")
            .attr("class", "label")
            .attr("x", l=>l.x)
            .attr("y", l=>l.y)
            .transition().duration(1000).delay(1000)
            .attr("opacity", 1)
            .text(ft_name);
    }
}

// funzione che mostra il grafico
var line = d3.line().x(d => d.x).y(d => d.y);   // coordinate del vertice per ogni elemento del dataset
function showData(data) {
    showAxis(data);                 // crea gli assi e le griglie

    allCoordinates = []
    for (var i = 0; i < data.length; i ++){
        let d = data[i];
        let color = oScale(JSON.stringify(d));
        let coordinates = getPathCoordinates(d);
        allCoordinates.push(coordinates)
        

        // Enter clause: add new elements
        svg.append("path")
           .datum(coordinates)
           .attr("class", "polygon")
           .attr("d", d3.line().x(d => d.x).y(d => d.y))
           .attr("stroke-width", 3)
           .attr("stroke", color)
           .attr("fill", color)
           .attr("stroke-opacity", 1)
           .transition().duration(2500)
           .attr("opacity", 0.3);
    }

    i = 0;
    allCoordinates.forEach(function(d) {
        let color = oScale(JSON.stringify(d));
        // cerchi   ##### NON FUNZIONAAAA CANCELLAREEEEE
        let circle = svg.append("g")
        .selectAll(".points")
            .data(d);

        circle.exit().remove(); // exit

        circle.enter()  // enter
            .append("circle")
            .attr("class", "points")
            .attr("id", "point"+i++)
            .attr("cx", function(f){return f.x;})
            .attr("cy", function(f){return f.y;})
            .attr("fill", color)
            .attr("stroke", "gray")
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .transition().delay(2500)
            .attr("r", radius);
            
        
    })

        
    
}

// Idea: prendo le coordinate del punto in cui clicco (vedi ANIMAZIONI per vedere come prendere bene le coordinate),
// lo trasformo in angolo e poi ne ricavo il quadrante. Dal numero che ottengo scambio i dati e aggiorno il disegno.