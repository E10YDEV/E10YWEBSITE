---
title: 'Dawkins, biomorfos y evolución I'
description: 'Introducción a teoria evolutiva mediante Biomorphos.'
pubDate: 'Apr 07 2025'
heroImage: '/WebExt_Diagram.png'
categories: ['Biologia']
authors: ['E10Y']
tags: ['ciencia', 'js']
---
Recuerdo que, antes de adentrarme en el mundo de la programación, miraba con fascinación los dibujos generados por Richard Dawkins en su libro El relojero ciego. Me preguntaba si algún día sería capaz de programar algo así.

Estos dibujos, conocidos como biomorfos, formaban parte de un experimento que Dawkins diseñó para representar visualmente cómo funciona la evolución. ¿Pero qué son exactamente los biomorfos?

Los biomorfos son figuras generadas por un programa que Dawkins escribió en lenguaje C. La idea era simular el proceso evolutivo, mostrando cómo formas complejas pueden surgir a través de pequeños cambios acumulados, sin la necesidad de un diseñador inteligente.

La base del programa es sencilla: mediante líneas y reglas matemáticas simples, se generan figuras que evolucionan con cada generación. En cada iteración, se añaden o modifican rasgos (nuevas líneas o formas), y es el usuario quien decide cuál de las figuras "sobrevive". Esa figura pasa sus características a la siguiente generación, emulando el papel de la selección natural en la naturaleza, que en el mundo real sería determinada por la adaptación al entorno.

## Mi versión 
Desconozco por completo que aproximación realizo Dawkins en su momento, pero en su día realice mi propia versión. Cabe destacar que este programa lo realice recién empecé a entender la programación de forma que muchos detalles de la misma son mejorables.

El manejo es muy sencillo clicando en cada cuadrado puedes elegir que mutación prefieres que herede la descendencia. También con el click derecho puedes producir una "involución" eliminando tantas mutaciones como desees. 

<p class="codepen" data-height="600" data-theme-id="dark" data-slug-hash="jOQXogv" data-pen-title="Untitled" data-user="faek123" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/faek123/pen/jOQXogv">
  Untitled</a> by faek (<a href="https://codepen.io/faek123">@faek123</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

## Cómo funciona

La estructura básica desde la que partimos es un array de líneas. Cada línea está formada por un par de puntos: punto A y punto B, y cada punto tiene coordenadas `[x, y]` en una escala del 0 al 100 (porcentaje relativo al tamaño del canvas).

```js
this.DNA = [[[50, 50], [50, 50]]];
```

A partir de este segmento original, comenzamos a añadir nuevas "mutaciones" utilizando la última línea generada. Estas mutaciones son aleatorias, pero **siempre parten de los últimos puntos añadidos al "ADN"**.

Para ello, simplemente calculamos la **ecuación de la recta** que une los dos últimos puntos:

> `y = y1 + m(x − x1)`, donde `m` es la pendiente.

Luego elegimos un valor aleatorio de `x` dentro del rango del segmento anterior, calculamos su correspondiente `y` en la recta, y después generamos un segundo punto cercano (mutación) alrededor de este primero.

```js
var m = (y2 - y1) / (x2 - x1); // Pendiente entre dos puntos
var x = generarNumeroEntre(x1, x2); // Valor aleatorio de X en el rango
var y = y1 + m * (x - x1); // Coordenada Y correspondiente
let random1 = generarNumeroEntre(x - 20, x + 20);
let random2 = generarNumeroEntre(y - 20, y + 20);
let newPointB = [random1, random2]; // Punto aleatorio cercano al anterior
```

Una vez generados los dos puntos de la nueva mutación, simplemente trazamos una línea entre ellos y dibujamos su imagen especular para darle **simetría** al biomorfo.

Para añadir la posibilidad de **involución**, se puede implementar una función que elimine la última mutación (es decir, elimine el último elemento del array `DNA`) y redibuje el biomorfo completo.

## Conceptos evolutivos
Para no hacer esta entrada más larga y pesada me ahorrado todos los conceptos genéticos... peeero si te interesa el tema la siguiente entrada del blog es una explicación básica de como funciona la expresión génica.

---

#### Fuentes y links de interés:

* Documentación general Web Extensions: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
* Documentación Manifest: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
* Ejemplos de extensiones: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Examples
* Mini guía general de Web Extensión: https://medium.com/@TusharKanjariya/getting-started-with-developing-browser-extensions-eb4a7d8658b3
* Repositorio de XpathHunt: https://github.com/E10YDEV/XpathHunt
* XpathHunt en la store: https://addons.mozilla.org/es/firefox/addon/xpathhunt/
