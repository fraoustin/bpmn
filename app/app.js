import $ from 'jquery';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import minimapModule from 'diagram-js-minimap';


import customRendererModule from './custom';

import customControlsColorModule from './customcolors';

import diagramXML from '../resources/newDiagram.bpmn';

var modeler = new BpmnModeler({
  container: '#js-canvas',
  additionalModules: [
    minimapModule,
    customRendererModule,
    customControlsColorModule
  ]
});

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
 

}, 500);

modeler.on('commandStack.changed', exportArtifacts);

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