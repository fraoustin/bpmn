export default class CustomContextPad {
  constructor(config, contextPad, modeling, create, elementFactory, injector, translate) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.modeling = modeling

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      autoPlace,
      create,
      elementFactory,
      modeling
    } = this;

    return {
      'set-color-black': {
        group: 'color',
        className: 'bpmn-icon-color-black',
        title: 'Color Red',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'rgb(0, 0, 0)', 'rgb(255, 255, 255)')
          }
        }
      },
      'set-color-red': {
        group: 'color',
        className: 'bpmn-icon-color-red',
        title: 'Color Red',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'rgb(229, 57, 53)', 'rgb(255, 255, 255)')
          }
        }
      },
      'set-color-orange': {
        group: 'color',
        className: 'bpmn-icon-color-orange',
        title: 'Color Orange',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'rgb(251, 140, 0)', 'rgb(255, 255, 255)')
          }
        }
      },
      'set-color-blue': {
        group: 'color',
        className: 'bpmn-icon-color-blue',
        title: 'Color Blue',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'rgb(30, 136, 229)', 'rgb(255, 255, 255)')
          }
        }
      },
      'set-color-purple': {
        group: 'color',
        className: 'bpmn-icon-color-purple',
        title: 'Color Purple',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'rgb(142, 36, 170)', 'rgb(255, 255, 255)')
          }
        }
      },
      'set-color-green': {
        group: 'color',
        className: 'bpmn-icon-color-green',
        title: 'Color Green',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'rgb(67, 160, 71)', 'rgb(255, 255, 255)')
          }
        }
      },
      'set-color-grey': {
        group: 'color',
        className: 'bpmn-icon-color-grey',
        title: 'Color Grey',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'lightgray', 'rgb(255, 255, 255)')
          }
        }
      },
      /* fill */
      'set-color-red-fill': {
        group: 'colorfill',
        className: 'bpmn-icon-color-red-fill',
        title: 'Color Red',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'rgb(229, 57, 53)', 'rgb(255, 205, 210)')
          }
        }
      },
      'set-color-orange-fill': {
        group: 'colorfill',
        className: 'bpmn-icon-color-orange-fill',
        title: 'Color Orange',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'rgb(251, 140, 0)', 'rgb(255, 224, 178)')
          }
        }
      },
      'set-color-blue-fill': {
        group: 'colorfill',
        className: 'bpmn-icon-color-blue-fill',
        title: 'Color Blue',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'rgb(30, 136, 229)', 'rgb(187, 222, 251)')
          }
        }
      },
      'set-color-purple-fill': {
        group: 'colorfill',
        className: 'bpmn-icon-color-purple-fill',
        title: 'Color Purple',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'rgb(142, 36, 170)', 'rgb(225, 190, 231)')
          }
        }
      },
      'set-color-green-fill': {
        group: 'colorfill',
        className: 'bpmn-icon-color-green-fill',
        title: 'Color Green',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'rgb(67, 160, 71)', 'rgb(200, 230, 201)')
          }
        }
      },
      'set-color-grey-fill': {
        group: 'colorfill',
        className: 'bpmn-icon-color-grey-fill',
        title: 'Color Grey',
        action: {
          click: function(event, element) {
            setColor(modeling, element, 'gray', 'lightgray')
          }
        }
      },

    };
  }
}

function setColor(modeling, element, stroke, fill) {
  var bo = (element && element.businessObject) || element;
  var di = bo.di;

  var ns = 'http://www.omg.org/spec/BPMN/non-normative/color/1.0' ;

  modeling.updateProperties(element, {
    di: {
      'xmlns:color': ns,
      'stroke': stroke
    }
  });

  modeling.updateProperties(element, {
    di: {
      'xmlns:color': ns,
      'fill': fill
    }
  });
}



CustomContextPad.$inject = [
  'config',
  'contextPad',
  'modeling',
  'create',
  'elementFactory',
  'injector',
  'translate',
];