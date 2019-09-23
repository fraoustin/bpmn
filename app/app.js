import $ from 'jquery';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import minimapModule from 'diagram-js-minimap';

import customRendererModule from './custom';

import diagramXML from '../resources/newDiagram.bpmn';

var modeler = new BpmnModeler({
  container: '#js-canvas',
  additionalModules: [
    minimapModule,
    customRendererModule
  ]
});

function createNewDiagram() {
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

var exportArtifacts = debounce(function() {

  saveSVG(function(err, svg) {
    setEncoded($('#svg'), 'diagram.svg', err ? null : svg);
  });
  saveDiagram(function(err, svg) {
    setEncoded($('#export'), 'diagram.bpmn', err ? null : svg);
  });


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
  reader.readAsText(document.getElementById('fileUpload').files[0])
})

$("#open").click(openFile)