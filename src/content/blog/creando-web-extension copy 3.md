---
title: 'naveptosuitectura de una Web Extension'
description: 'Pequeña guía sobre conceptos y arquitectura de una Web Extension'
pubDate: 'Nov 08 2023'
heroImage: '/WebExt_Diagram.png'
categories: ['javascript']
authors: ['E10Y']
tags: ['navegador', 'guia']
---
Recientemente, mientras experimentaba con comandos XPath en la terminal del navegador, me pregunté si podría mejorar la visualización de los resultados. Después de descubrir alternativas útiles, decidí desarrollar mi propia extensión en lugar de depender de las creadas por otros desarrolladores.Este post surge de está pequeña investigación para realizar la extensión XPathHunt.

Puedes ver el código completo de la extensión en GitHub [XpathHunt GitHub](https://github.com/E10YDEV/XpathHunt).

Para probar la extensión desde la tienda de Mozilla [XpathHunt MDN Addons](https://addons.mozilla.org/es/firefox/addon/xpathhunt/).

Esta guía proporciona una visión general de cómo desarrollar una extensión (en este ejemplo mi extensión XpathHunt que resalta expresiones Xpath en pantalla). **No pretende ser una guía paso a paso al uso si no unos conceptos básicos para falicitar tu inicio en el desarrollo de extensiones.**

## Arquitectura básica de una extensión

Antes de comenzar, es importante dedicar unos minutos a comprender que partes conforman una extensión y cómo se comunican las diferentes partes entre sí.

### 1. Partes de la extensión

He diseñado un pequeño diagrama para que se entienda la separación de componentes y flujo de información.

![Web Extension Diagram](/WebExt_Diagram.png)

- **Manifest:** Es un archivo JSON y es la base de tu extensión, aporta al navegador la información necesaria para que gestione todos los archivos de tu extensión. Existen tres versiones, siendo la V2 la más común, pero en el ejemplo de esta entrada, usaremos la V3.
- **Content Script:** Es el script que se inyectará en la página donde se ejecuta la extensión. Se ejecuta en el contexto de la web visitada, por lo tanto **solo tiene acceso al DOM de esta** y  limitaciones en uso de las API del navegador .Este script es el encargado de analizar la web, responder o escuchar al background script.
- **Background Script:** Es un tipo de script que se ejecuta en segundo plano, en un proceso separado del navegador. Tiene acceso a todas las APIs del navegador  pero a diferencia del Content Script, **no tiene acceso al DOM de la página web**. Es muy útil para establecer una comunicación entre los Content Scripts y los Web Accessible Scripts.
- **Web Accessible Resources:** Son todos los archivos necesarios para que la interfaz y el funcionamiento de la extensión. Un uso común es gestionar la interfaz a traves de vistas HTML y desde ahi cargar el resto de recursos para la interfaz de tu extensión.
- **Otros scripts:** En nuestro caso, vamos a utilizar un recurso web accesible para cargar nuestros scripts. Sin embargo, dependiendo del tipo de interfaz que desees generar, es posible que necesites scripts emergentes (Pop-Up Scripts), scripts de barra lateral (Sidebar Scripts) u opciones (Options Scripts).

### 2. Flujo de comunicación dentro de la extensión

Para poder enviar información entre dos partes de la extensión existen varias APIs, veamos un ejemplo con `runtime.sendMessage()` y con su listener.

```jsx
// Sintaxis del runtime.sendMessage //
browser.runtime.sendMessage(
extensionId,             // optional string
message,                 // any
options                  // optional object
)

// Manda un Objeto Literal con los campos action y requestValue //
browser.runtime.sendMessage({ action: "action1", requestValue: "myValue" })

// Escucha todos los eventos de tipo sendMessage //
browser.runtime.onMessage.addListener(handleActions);
```

> Para realizar conexiones persistentes y bidereccionales puedes usar la API `runtime.connect()` **,** mientras que `runtime.sendMessage()` permite enviar mensajes de una sola vez sin mantener una conexión activa.

Como hemos visto anteriormente, existen limitaciones de acceso y comunicación entre los diferentes componentes de la extensión. Para solucionar este problema y permitir la comunicación entre un Content Script y un Web Accessible Script (es decir, entre la página web visitada y los scripts de tu extensión), podemos utilizar un Background Script. Este módulo actuará como un "handler" entre ambos.

En la sección del Background Script se muestra un ejemplo de cómo enrutar el envío de información utilizando la API `tabs.sendMessage()`.

La comunicación de forma simplificada tendrá esta estructura:

Content Script 🔄 Background Script 🔄 Extension Script

## Debugging

Para probar la extensión durante el desarrollo es tan sencillo como ir a [about:debugging#/runtime/this-firefox]([about:debugging#/runtime/this-firefox]) y cargar el manifest de nuestra extensión.

Es importante recordar que no todos los scripts tienen acceso al DOM de tu navegador por lo tanto no podrás visualizar los errores con un `console.log()` o `console.error()`. Para debugear un Background script en la misma página donde cargargas tu extensión aparecera un boton llamada “Inspect” el cual abrira una consola que tiene acceso a este script.

## Creando la extensión

Para este ejemplo, vamos a inyectar un iframe en la parte superior de la web. Sin embargo, existen alternativas como Pop-Up, SideBar, etc., que son incluso más fáciles de implementar, solo con declararlas en el Manifest, tendríamos el trabajo hecho. Aquí os dejo la estructura de archivos para nuestra extensión:

```
/
├── background.js
├── content.css
├── content.js
├── icon.jpg
├── interface
│   ├── menu
│   │   ├── menu.css
│   │   ├── menu.html
│   │   └── menu.js
│   └── settings
│       ├── menu2.css
│       ├── menu2.html
│       └── menu2.js
├── manifest.json
├── themes.js

```

### 1. Manifest

Este es el primer archivo que debemos generar, veamos un ejemplo de nuestra extensión con un Manifest V3

```json
{
    "manifest_version": 3,
    "name": "XpathHunt",
    "version": "1.0",
    "description": "XpathHunt is a browser extension that allows you to search in real-time for the results of an XPath expression. It is 100% customizable with themes and text highlighting.",
    "permissions": [
        "activeTab",
        "storage",
        "tabs"
    ],
    "action": {
        "default_icon": {
            "32": "icon.jpg"
        },
        "default_title": "o"
    },
    "background": {
        "scripts": ["background.js"]
    },
    "browser_specific_settings": {
        "gecko": {
            "id": "e10ydev@protonmail.com"
        }
    },
    "web_accessible_resources": [
        {
            "resources": ["interface/menu/menu.html"],
            "matches": ["<all_urls>"]
        },
        {
            "resources": ["interface/settings/menu2.html"],
            "matches": ["<all_urls>"]
        },
        {
            "resources": ["themes.js"],
            "matches": ["<all_urls>"]
        }
    ],
    "content_scripts": [
        {
            "matches": ["<all_urls>"],
            "js": ["content.js"]
        },
        {
            "matches": ["<all_urls>"],
            "css": ["content.css"]
        }
    ]
}

```

En este JSON, declaramos todos los archivos y características de nuestra extensión.

- **Permissions**: Estos son los permisos necesarios para que nuestra extensión funcione. Puedes consultar la lista completa de permisos en la [documentación de MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions).
- **ID**: Si no asignas un ID a la extensión, se generará uno temporal durante el proceso de depuración. Sin embargo, si planeas subirla a una tienda o firmarla, deberás generar un ID único. En este ejemplo, he utilizado mi correo electrónico.
- **Web Accessible Resources**:  En nuestro caso, al tratarse de un iframe, hemos generado dos archivos HTML (uno como vista principal y otro como ajustes) que se cargarán como fuente en el iframe inyectado en la página.
- **Content Scripts**:  Agregamos un content.js que se encargará de analizar la web, escuchar y responder al background script. También agregamos, en nuestro caso, un content.css para agregar nuevas clases personalizadas a la página web visitada sin tener que recurrir a usar estilos en línea.

En el caso de que no utilices un iframe, la forma de agregar la interfaz web de tu extensión es declarando el tipo de interfaz que deseas utilizar. Aquí te dejo dos ejemplos:

```json
/// Para declarar un SIDEBAR ///
"sidebar_action": {
    "default_icon": "icons/star.png",
    "default_title" : "Annotator",
    "default_panel": "sidebar/panel.html"
}
/// Para declarar un POP-UP ///
"browser_action": {
    "default_title": "BG Picker",
    "default_popup": "popup/bgpicker.html"
}

```

> Al leer la documentación de la API del navegador, es muy **importante que verifiques para qué versión del manifest** están escritas las funciones, ya que la forma de llamarlas puede variar.

```json
/// Funciona en la V2 pero no en la V3 ///
browser.browserAction.onClicked.addListener(listener);
/// Funciona en la V3 pero no en la V2 ///
browser.action.onClicked.addListener(listener);

```

### 2. Content Scripts

A continuación, describiremos las partes esenciales de nuestro Content Script, que se inyectará en la página visitada. Para obtener información más detallada y completa, te invito a visitar el repositorio mencionado al principio. Allí encontrarás el código completamente comentado para facilitar su comprensión.

### 2.1 Inyección del iframe

Al principio, creamos un iframe y asignamos en el src un Web Accesible Resource (un HTML con nuestra interfaz).

```jsx
// Crear un iframe para la interfaz visual //
var iframe = document.createElement("iframe");
document.body.style.marginTop = "150px";
iframe.src = browser.runtime.getURL("interface/menu/menu.html");
iframe.id = "xpathHuntIframe";
document.body.appendChild(iframe);

```

### 2.2 Localización del resultado de la búsqueda XPath

Esta parte no es especialmente relevante, solo explica cómo funciona el sistema de evaluación de mi extensión.

El siguiente fragmento de código es el motor o función principal de búsqueda de expresiones XPath. Sin entrar en muchos detalles sobre su funcionamiento, podemos resumir su funcionamiento de la siguiente manera:

1. La variable `nodos` almacenará los resultados de la búsqueda realizada con `document.evaluate()`.
2. Comprueba si esta variable contiene información de búsquedas previas y, en ese caso, elimina las clases "customXPathHunt" de estos elementos para poder asignar nuevas clases a la búsqueda actual sin solapar con resultados previos.
3. Realiza la búsqueda de la expresión XPath y almacena el resultado en `nodos`. Posteriormente, asignará una clase "customXPathHunt" para resaltar de forma visual el resultado.
4. Envía el texto resultante de la búsqueda (innerHTML) al Background script.

```jsx
var nodos = []; // Variable para cargar y eliminar la clase de resaltado de los resultados XPath

// Sistema para encontrar la expresión XPath y asignar (o eliminar) la clase personalizada //
function xpathFinder(xpath) {
    try {
        for (var i = 0; i < nodos.length; i++) {
            nodos[i] && nodos[i].classList.toggle("customXPathHunt", false); 
// Limpia todas las clases "customXPathHunt" de los nodos
        }
    } catch (error) {
        console.error("Error en la expresión XPath:", error);
    }
    nodos = [];
    let expresiónXPath = xpath;
    let resultadoXPath = document.evaluate(expresiónXPath, document, null, XPathResult.ANY_TYPE, null);

    let nodo = resultadoXPath.iterateNext();
    while (nodo) {
        nodos.push(nodo);
        nodo = resultadoXPath.iterateNext();
    }
    let stringOutput = "";
    nodos.forEach(function (nodo) {
        stringOutput = stringOutput + nodo.innerText + "\\n";
        nodo.classList.add("customXPathHunt");
    });
    browser.runtime.sendMessage({ action: "updateOutput", requestValue: stringOutput }); // Enviar a la interfaz (menu.js) los resultados de la expresión XPath
}

```

### 2.3 Envio y escucha de eventos

Como he adelantado al principio de la entrada para el envio y escucha de los eventos usaremos las APIs `runtime.sendMessage()` y `onMessage.addListener()` para poder enviar los resultados de la busqueda a nuestros scripts de la extensión, mediante el Background Script como intermediario.

Es muy recomendable gestionar el envio y escucha de eventos usar objetos literales con un campo que determina la acción que quieres realizar ya que `onMessage.addListener()` escuchará todos lo eventos de tipo sendMessage. Para ello le pasamos una funcion al listener que se encarge de gestionar el mensaje.

```jsx
//Ejemplo de SendMessage // 
browser.runtime.sendMessage({ action: "actionOne", requestValue: "myValue" })

// Ejemplo de Listener //
browser.runtime.onMessage.addListener(handleActions);

// Función llamada por el Listener para gestionar los Message recibidos //
function handleActions(message) {
    switch (message.action) {
        case "actionOne":
            actionOne(message.value);
            break;
        case "actionTwo":
            actionTwo(message.value);
            break;
        default:
            break;
    }
}
```

Dentro de el `handleAction()` iremos definiendo o asignando las funciones que necesitemos según el mensaje recibido por ejemplo si recibimos un “message” con la `“action”:"xpathUpdate”` llamaremos a la función (previamente detallada) `xpathFinder(message.value)` para realizar una búsqueda.

### 2. Background Script

Ya hemos visto cómo enviar y recibir mensajes desde el content script, pero estos, al ejecutarse en el contexto de la web, no llegan a los scripts de la interfaz de nuestra extensión (ya sean Pop-Up scripts, web accesible scripts, etc.). Aquí es donde entra en juego el Background Script, que actuará como intermediario entre ambas partes de la extensión. Para ello, el script de fondo tiene acceso a una API que permite enviar mensajes entre scripts que estén en la misma pestaña activa, llamada `tabs.sendMessage()`. Esta función funciona de forma similar a `runtime.sendMessage()` explicada anteriormente, pero en este caso debemos indicarle el ID de la pestaña activa.

```jsx
//Sintaxis de tabs.sendMessage //
browser.tabs.sendMessage(
  tabId,     // integer
  message,   // any
  options    // optional object
)
```

Para redirigir mensajes entre componentes de tu extensión primero, debes crear un event listener en el  Background script que debe recibir el mensaje del resto de scripts.

Dentro del event listener, puedes utilizar `tabs.sendMessage()` para enviar un mensaje a una pestaña específica. Para determinar a qué pestaña enviar el mensaje, puedes obtener el `tabId` necesario a partir del segundo parámetro del listener. El segundo parámetro es un objeto que contiene información sobre el remitente, y en particular, puedes acceder a `sender.tab.id` para obtener el `tabId` de la pestaña desde la cual se envió el mensaje.

```jsx
function tabsRequest(message, sender) {
  browser.tabs.sendMessage(sender.tab.id, { action: message.action, requestValue: message.requestValue });
}
browser.runtime.onMessage.addListener(tabsRequest);
```

### 3. Interfaz de la extensión

Ya tenemos todo el motor listo para funcionar, solo nos quedaría crear un HTML con la vista de nuestra aplicación. Vinculamos un archivo JS con eventListener para captar las diferentes acciones y enviarlas. Estos scripts tienen acceso a la API `runtime.sendMessage()` así que se pueden enviar al background script para posteriormente ser reenviados al content script.

Recuerda antes de asignar o invocar la interfaz ya sea el src del Iframe o un Pop-Up etc haberla declarado correctamente en el manifest.

## Finalización y aclaraciones

Para publicar una extensión es tan sencillo como comprimir tus archivos en un ZIP y subirlo a la store de Mozilla donde pasará un proceso de revisión manual que es bastante intuitivo, para la firma de la extensión el proceso es bastante similar y la web de MDN te indica paso a paso como realizar el proceso.

Esta guía esta basada en el navegador de Mozilla pero los conceptos y uso de las API es idéntico en la mayoria de casos solo con cambiar `browser` por `chrome` debería funcionar.

Si ves algún error en la extensión o en las explicaciones dadas en este artículo te invito a que te pongas en contacto conmigo.

---

#### Fuentes y links de interés:

* Documentación general Web Extensions: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
* Documentación Manifest: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
* Ejemplos de extensiones: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Examples
* Mini guía general de Web Extensión: https://medium.com/@TusharKanjariya/getting-started-with-developing-browser-extensions-eb4a7d8658b3
* Repositorio de XpathHunt: https://github.com/E10YDEV/XpathHunt
* XpathHunt en la store: https://addons.mozilla.org/es/firefox/addon/xpathhunt/
