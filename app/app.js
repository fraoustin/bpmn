import $ from 'jquery';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import minimapModule from 'diagram-js-minimap';

var propertiesPanelModule = require('bpmn-js-properties-panel'),
  // providing camunda executable properties, too
  propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda');


import customRendererModule from './custom';

import customControlsColorModule from './customcolors';

import diagramXML from '../resources/newDiagram.bpmn';

var modeler = new BpmnModeler({
  container: '#js-canvas',
  propertiesPanel: {
    parent: '#js-properties-panel'
  },
  additionalModules: [
    minimapModule,
    customRendererModule,
    customControlsColorModule,
    propertiesPanelModule,
    propertiesProviderModule
  ]
});


function createCSSSelector (selector, style) {
  if (!document.styleSheets) return;
  if (document.getElementsByTagName('head').length == 0) return;

  var styleSheet,mediaType;

  if (document.styleSheets.length > 0) {
    for (var i = 0, l = document.styleSheets.length; i < l; i++) {
      if (document.styleSheets[i].disabled) 
        continue;
      var media = document.styleSheets[i].media;
      mediaType = typeof media;

      if (mediaType === 'string') {
        if (media === '' || (media.indexOf('screen') !== -1)) {
          styleSheet = document.styleSheets[i];
        }
      }
      else if (mediaType=='object') {
        if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
          styleSheet = document.styleSheets[i];
        }
      }

      if (typeof styleSheet !== 'undefined') 
        break;
    }
  }

  if (typeof styleSheet === 'undefined') {
    var styleSheetElement = document.createElement('style');
    styleSheetElement.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

    for (i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].disabled) {
        continue;
      }
      styleSheet = document.styleSheets[i];
    }

    mediaType = typeof styleSheet.media;
  }

  if (mediaType === 'string') {
    for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
      if(styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase()==selector.toLowerCase()) {
        styleSheet.rules[i].style.cssText = style;
        return;
      }
    }
    styleSheet.addRule(selector,style);
  }
  else if (mediaType === 'object') {
    var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
    for (var i = 0; i < styleSheetLength; i++) {
      if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
        styleSheet.cssRules[i].style.cssText = style;
        return;
      }
    }
    styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
  }
}


function createNewDiagram() {
  $('#nameFile').text("diagram");
  openDiagram(diagramXML);
}

function openDiagram(xml) {

  modeler.importXML(xml, function(err) {

    // access modeler components
    var canvas = modeler.get('canvas');
    var overlays = modeler.get('overlays');

    // zoom to fit full viewport
    canvas.zoom('fit-viewport');

  });
  $(".djs-palette").addClass('open');
  $(".zoom > a").addClass('active');
  
}

function setEncoded(link, name, data) {
  var encodedData = encodeURIComponent(data);
  if (data) {
    $(".djs-palette").addClass('open');
    link.addClass('active').attr({
      'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
      'download': name
    });
  } else {
    $(".djs-palette").removeClass('open');
    link.removeClass('active');
  }
}

function getMinimap(){
  if ($('#minimap').hasClass("open")) {
    modeler.get('minimap').close();
    $('#minimap').removeClass("open");    
  } else {
    modeler.get('minimap').open();
    $('#minimap').addClass('open');
  }
}

function fitZoom() {
  modeler.get('canvas').zoom('fit-viewport');
} 

function addZoom() {
  modeler.get('canvas').zoom(modeler.get('canvas').zoom() * 1.15);
} 

function subZoom() {
  modeler.get('canvas').zoom(modeler.get('canvas').zoom() * 0.85);
} 

function savePNG() {
  modeler.saveSVG(_savePNG);
}

function _savePNG(err, svg) {
  var link = $('#png');
  var name = getNameFile('png');
  let clone = new DOMParser().parseFromString(svg, 'text/html');
  let div = clone.body.firstChild;
  div.removeAttribute('width');
  div.removeAttribute('height');
  var data = (new XMLSerializer()).serializeToString(div);
  if (data) {
    $(".djs-palette").addClass('open');
    var img = new Image();
    var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var DOMURL = window.URL || window.webkitURL || window;
    var url = DOMURL.createObjectURL(svgBlob);
    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');
    var svgwin = document.getElementsByTagName('svg')[0];
    var rect = svgwin.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width  = rect.width+'px';
    canvas.style.height = rect.height+'px';

    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        var imgURI = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
        link.addClass('active').attr({
          'href': imgURI,
          'download': name
        });
    };
    img.src = url;
  } else {
    $(".djs-palette").removeClass('open');
    link.removeClass('active');
  }
}
function savePNGDav() {
  modeler.saveSVG(_savePNGDav);
}

function _savePNGDav(err, svg) {
  var link = $('#pngdav');
  var name = getNameFile('png');
  let clone = new DOMParser().parseFromString(svg, 'text/html');
  let div = clone.body.firstChild;
  div.removeAttribute('width');
  div.removeAttribute('height');
  var data = (new XMLSerializer()).serializeToString(div);
  if (data) {
    $(".djs-palette").addClass('open');
    var img = new Image();
    var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var DOMURL = window.URL || window.webkitURL || window;
    var url = DOMURL.createObjectURL(svgBlob);
    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');
    var svgwin = document.getElementsByTagName('svg')[0];
    var rect = svgwin.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width  = rect.width+'px';
    canvas.style.height = rect.height+'px';

    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        var imgURI = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
        link.addClass('active').attr({
          'href': imgURI,
          'download': name
        });
    };
    img.src = url;
  } else {
    $(".djs-palette").removeClass('open');
    link.removeClass('active');
  }
}

function saveSVG(done) {
  modeler.saveSVG(done);
}

function saveDiagram(done) {
  modeler.saveXML({ format: true }, function(err, xml) {
    done(err, xml);
  });
}

function debounce(fn, timeout) {

  var timer;

  return function() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, timeout);
  };
}

function getNameFile(ext) {
  return $("#nameFile").text()+'.'+ext;
}

var exportArtifacts = debounce(function() {
  saveSVG(function(err, svg) {
    setEncoded($('#svg'), getNameFile('svg'), err ? null : svg);
  });
  saveDiagram(function(err, svg) {
    setEncoded($('#export'), getNameFile('bpmn'), err ? null : svg);
  });
  savePNG();

  saveDiagram(function(err, svg) {
    setEncodedDav($('#exportdav'), getNameFile('bpmn'), err ? null : svg);
  });
  savePNGDav();
}, 500);

modeler.on('commandStack.changed', exportArtifacts);
modeler.on('element.click', changeProperties);

$('#new').click(createNewDiagram);
$('#fitzoom').click(fitZoom);
$('#addzoom').click(addZoom);
$('#subzoom').click(subZoom);
$('#minimap').click(getMinimap);

$(".djs-palette").removeClass('open');

function openFile() {
  $("#fileUpload").click();
};

$("#fileUpload").change(function () {
  var reader = new FileReader();
  reader.onload = function (evt) {
      openDiagram(evt.target.result);
  };
  $("#nameFile").text(document.getElementById('fileUpload').files[0].name.split('.')[0])
  reader.readAsText(document.getElementById('fileUpload').files[0])
})

$("#open").click(openFile)

/* manage height of documentation */

var hdoc = $(window).height() - 250;
var mdoc = $(window).height() - 100;
createCSSSelector('#camunda-documentation', 'height: ' + hdoc + 'px');
createCSSSelector('.spectext', 'height: ' + mdoc + 'px');

function changeProperties(event)
{
  if ($("#camunda-name[name='text']").length > 0) {
    $("[data-group='documentation']").addClass("bpp-hidden");
    $("#camunda-name[name='text']").addClass("spectext");
  } else {
    $("[data-group='documentation']").removeClass("bpp-hidden");
    $("#camunda-name[name='text']").removeClass("spectext");
  }
}

/* integration BPMPlatform */

function encodeData(data) {
  return Object.keys(data).map(function(key) {
      return [key, data[key]].map(encodeURIComponent).join("=");
  }).join("&");
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function readFileFromDav(fs, path){
  console.time("readFile " + path)
  try {
    var txt=fs.file(path).read();
    if (txt.indexOf("<head><title>404 Not Found</title></head>") == -1) {
      console.timeEnd("readFile " + path);
      openDiagram(txt)
    } else {
      console.timeEnd("readFile " + path);
      createNewDiagram();
    }
  } catch (error) {
      console.timeEnd("readFile " + path);
      createNewDiagram();
  }
}

function writeFile(fs, path, txt){
  fs.file(path).write(txt)
}

function writeFileDav(){
  var url = window.location.protocol + '//' + window.location.host + '/';
  var fs = new WebDAV.Fs(url);
  var path = 'auth/' + findGetParameter("edit");
  writeFile(fs, path, $("#exportdav").attr('data'));
}

function setEncodedDav(link, name, data) {
  link.addClass('active');
  var encodedData = encodeURIComponent(data);
  
  if (data) {
    $(".djs-palette").addClass('open');
    link.addClass('active').attr({
      'data': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
    });
  } else {
    $(".djs-palette").removeClass('open');
    link.removeClass('active');
  }
}

if (findGetParameter("edit")) {
  $("#toolbox-standalone").addClass("bpp-hidden");
  var url = window.location.protocol + '//' + window.location.host + '/';
  var fs = new WebDAV.Fs(url);
  var path = 'auth/' + findGetParameter("edit");
  readFileFromDav(fs, path)
} else {
  $("#toolbox-bpmp").addClass("bpp-hidden");
}