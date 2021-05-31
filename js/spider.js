// variabili globali
var data;       // dati in ingresso dal file json
var w = 800;    // width dello spider chart
var h = 800;    // height dello spider chart
var cx = w/2;   // centro sull'asse X del chart
var cy = h/2;   // centro sull'asse Y del chart
var radius = 5;      // raggio dei points
var pathStrokeWidth = 3;    // width del path
var pathOpacity = 0.3;
var rScale = d3.scaleLinear().range([0,250]);           // inizializzo la scala
var inverseRScalse = d3.scaleLinear().domain([0,250]);  // scala inversa per ottenere i punti originali
var oScale = d3.scaleOrdinal(d3.schemeCategory10);  // colori per i dati
var maxValue;   // valore massimo contenuto nel dataset
var minValue;   // valore minimo contenuto nel dataset
var lenAxis ;    // lunghezza massima degli assi
var updateTime = 500
var angles = [];


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

// funzione che restituisce l'angolo considerando il grado 0 l'asse verticale in alto
function getAngle(x,y){
    let r = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
    console.log("x "+x+"y "+y +"r " +r)
    let halfPI = 90*(Math.PI/180);  // 90° = 1/2 pi greco
    let alpha;
    if (x>0) {
        alpha = (Math.acos((x-7)/r)*(180/Math.PI));
        console.log("acos "+alpha)
        if (y>0) {
            alpha = 90 - alpha;
        }
        if (y<0) {
            alpha += 90;
        }
    }
    if (x<0) {
        alpha = (Math.asin((y)/r)*(180/Math.PI));
        console.log("asin "+alpha)
        if (y>0) {
            alpha += 270;
        }
        if (y<0) {
            alpha += 270
        }
    }

    console.log("gradi "+alpha);
}


// funzione che restituisce le coordinate relative in un svg
function clicked(evt){
    let e = evt.target;
    let x = evt.clientX - cx;
    let y = cy - evt.clientY;
    let angle = Math.atan((-x)/y);
    console.log("x:"+(x-5)+" y:"+(y-5)+" angle: "+angle);
    console.log(x)
    getAngle(x,y)
    updateData([{"a":1, "b":2, "c":3, "d":4, "e":5},data[8],data[7],data[6],data[5],data[4],data[3],data[2],data[1],data[0]]);

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
var tempPathColor;
function handleMouseOver(d, i) {
    let idPoint = "#"+d3.select(this).attr('id');   // id dei punti
    let idGPoint = "#g"+d3.select(this).attr('id'); // id del gruppo di punti
    let index = idPoint.substr(idPoint.length - 1); // prelevo l'indice i del gruppo di punti
    let idPath = "#polygon"+index;                  // id del path associato al gruppo di punti
    let pointCX = d3.select(this).attr("cx");       // posizione su asse X punto in focus
    let pointCY = d3.select(this).attr("cy");       // posizione su asse Y punto in focus
    tempPathColor = d3.select(idPath).attr("stroke");   // colore del poligono

    d3.selectAll(idPoint).raise();    // metto in primo piano il gruppo di punti
    // Selezione del gruppo di punti appartenenti allo stesso poligono
    d3.selectAll(idPoint)
        .transition()
        .attr("r", radius * 2);
        
    d3.select(idPath)
        .transition()
        .attr("opacity", .5)
        .attr("stroke-width", 5)
        .attr("stroke", "black");

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
    let index = idGroupPoint.substr(idGroupPoint.length - 1);      // prelevo l'indice i del gruppo di punti
    let idPath = "#polygon"+index;                  // id del path associato al gruppo di punti

    // Selezione del gruppo di punti appartenenti allo stesso poligono
    d3.selectAll(idGroupPoint)
        .transition()
        .attr("r", radius);

    d3.select(idPath)
        .transition()
        .attr("opacity", pathOpacity)
        .attr("stroke-width", pathStrokeWidth)
        .attr("stroke", tempPathColor);

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
    showAxis(data);                 // crea gli assi e le griglie
    showData(d);                    // mostra il grafico
}).catch(function(error){
    console.log(error)              // log in caso di errore
});

// Creazione del canvas SVG
var svg = d3.select("body")
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .attr("onclick", "clicked(evt)");

// Creazione delle griglie del grafico
function plotGrid() {
    let equalParts = (maxValue/5).toPrecision(2);
    lenAxis = equalParts*6;
    let ticks = [equalParts, equalParts*2, equalParts*3, equalParts*4, equalParts*5, lenAxis];
    
    // griglie
    let circle = svg.selectAll(".grid")
        .data(ticks);

    circle.exit().remove(); // exit

    circle.enter()  // enter
        .append("circle")
        .attr("class", "grid")
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
        angles.push(angle);
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

        axis_label.enter()  // enter
            .append("text")
            .attr("class", "label")
            .attr("id", "label"+i)
            .attr("x", l=>l.x)
            .attr("y", l=>l.y)
            .transition().duration(1000).delay(1000)
            .attr("opacity", 1)
            .text(ft_name);

    }
    console.log(angles)
}

// funzione che mostra il grafico
var line = d3.line().x(d => d[0]).y(d => d[1]);   // coordinate del vertice per ogni elemento del dataset
function showData(data) {
    allCoordinates = [];
    allListCoordinates = [];
    for (var i = 0; i < data.length; i ++){
        let d = data[i];
        let color = oScale(JSON.stringify(d));
        let coordinates = getPathCoordinates(d);    // con strutture [{'x':x,'y':y},...]
        listCoordinates = [];                       // con struttura [[x,y],[x,y],...]
        allCoordinates.push(coordinates)
        coordinates.push(coordinates[0])            // appendo alle coordinate la prima coordinata così da chiudere il path
        coordinates.forEach(function(d) {
            listCoordinates.push([d.x, d.y]);
        });
        // Enter clause: add new elements
        svg.append("path")
            .attr("class", "polygon")
            .attr("id", "polygon"+i)
            .attr("d", d3.line()(listCoordinates))
            .attr("stroke-width", 3)
            .attr("stroke", color)
            .attr("fill", color)
            .attr("stroke-opacity", 1)
            .transition().duration(2500)
            .attr("opacity", pathOpacity);
    }


    i = 0;
    allCoordinates.forEach(function(d) {
        let color = oScale(JSON.stringify(d));
        // cerchi
        let circle = svg.selectAll("#point"+i)
            .data(d);

        circle.enter()  // enter
            .append("circle")
            .attr("class", "points")
            .attr("id", "point"+i)
            .attr("cx", function(f){return f.x;})
            .attr("cy", function(f){return f.y;})
            .attr("fill", color)
            .attr("stroke", "gray")
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .transition().delay(2000)
            .attr("r", radius);
        i++;
        
    })

        
    
}

// Idea: prendo le coordinate del punto in cui clicco (vedi ANIMAZIONI per vedere come prendere bene le coordinate),
// lo trasformo in angolo e poi ne ricavo il quadrante. Dal numero che ottengo scambio i dati e aggiorno il disegno.

function updateData(data) {

    labels = Object.keys(data[0])
    for (var i = 0; i < labels.length; i++) {   // aggiornamento ASSI
        let ft_name = labels[i];

        //disegna le label degli assi
        let axis_label = svg.select("#label"+i);

        axis_label.transition(1000)
            .attr("opacity",0)
            .transition(1000).delay(1000)
            .attr("opacity",1)
            .text(ft_name);    
    }


    allCoordinates = [];
    allListCoordinates = [];
    for (var i = 0; i < data.length; i ++){ // Aggiornamento PATH
        let d = data[i];
        let coordinates = getPathCoordinates(d);    // con strutture [{'x':x,'y':y},...]
        listCoordinates = [];                       // con struttura [[x,y],[x,y],...]
        allCoordinates.push(coordinates)
        coordinates.push(coordinates[0])            // appendo alle coordinate la prima coordinata così da chiudere il path
        coordinates.forEach(function(d) {
            listCoordinates.push([d.x, d.y]);
        });
        // Enter clause: add new elements
        let path = svg.select("#polygon"+i)
            .transition().duration(1000)
            .attr("d", d3.line()(listCoordinates));
    }

    i = 0;
    allCoordinates.forEach(function(d) {    // Aggiornamento PUNTI
        let color = oScale(JSON.stringify(d));
        // cerchi
        let circle = svg.selectAll("#point"+i)
            .data(d);

        circle.transition().duration(1000) // Update
            .attr("cx", function(f){return f.x;})
            .attr("cy", function(f){return f.y;});
        
        circle.exit().remove(); // exit
            
        i++;  
    })
}
