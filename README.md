# Star Plot
Primo progetto di Visualizzazione delle Informazioni A.A. 2020/2021.

## GIF di presentazione
![Alt Text](https://github.com/rirolli/spider-chart/blob/master/media/RadarChart.gif)

## Indice
1. [Testo](#testo)
2. [Consegna](#consegna)
3. [Funzionalità](#funzionalità)
4. [Descrizione della repository](#desrizione-della-repository)

## Testo
Crea un file json con dei dati multivariati: ci sono 10 data-cases e ogni data-case ha cinque variabili quantitative i cui valori sono tutti positivi.

Prima disegna questo dataset tramite uno diagramma **"star plot"** (ogni variabile ha un suo asse, tutti gli assi si irradiano dallo stesso punto) in cui la prima variabile è usata per il primo asse, la seconda variabile è usata per il secondo asse, la terza variabile è usata per il
terzo asse e così via. Facendo click con il pulsante sinistro del mouse sullo spazio tra due assi questi due assi si scambiano di ruolo (i valori dell'asse precedente diventano i valori dell'asse seguente e viceversa). 
Fai in modo che le transizioni da una rappresentazione all'altra avvengano in modo il più fluido possibile (per esempio con un'animazione).

Usa le scale D3.js per mappare l'intervallo dei valori delle variabili (che è arbitrario) sull'intervallo dei valori delle coordinate, che dipende dalla tua interfaccia.

## Consegna
Il progetto dovrà essere svolto individualmente utilizzando JavaScript e D3.js **entro il 12 giugno 2021**.

Per la consegna è sufficiente che tu risponda a questa mail fornendo un link al progetto messo a disposizione su github. La valutazione di questo mini-progetto individuale peserà tre
punti sul voto finale.

## Funzionalità
* Rappresentazione dei dati su Star Plot con animazione di apertura;
* Scambio di coordinate adiacenti in modo fluido al click dell'utente in un qualsiasi settore del grafico;
* Evidenziazione dell'oggetto selezionato al passaggio del mouse (per ottenere questa visualizzazione bisogna passare il mouse sopra uno dei punti sugli assi del grafico o sopra una qualunque voce della legenda) per una visualizzazione più chiara con comparsa dei valori precisi per ogni punto dell'asse.

## Desrizione della Repository
La seguente repository è composta dai seguenti file e cartelle:
- **index.html** contenente il file HTML per visualizzare il grafico;
- **[/css](/css)** è la cartella contente il file ***style.css*** che descrive il CSS del file HTML;
- **[/data](/data)** è la cartella contenente il file JSON da cui prelevare i dati per la costruzione del grafico;
- **[/js](/js)** è la cartella contenente il file Javascript che si occupa della creazione e della gestione del grafico;
- **[/lib](/lib)** è la cartella contenente le librerie necessarie per il corretto funzionamento delpt Javascript:
  - ***d3.js v6.7.0***;
  - ***decimal.js v10.2.1***;
  - ***jquery-3.6.0.js v3.6.0***;
- **[/media](/media)** è la cartella contenente le immaggini e le GIF che compaiono nel file README.md
- **[/tools](/tools)** è la cartella contente lo script python responsabile della generazione del file JSON nella cartella ***/data***.
