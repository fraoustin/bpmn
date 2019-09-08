import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
  attr as svgAttr
} from 'tiny-svg';

import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

const HIGH_PRIORITY = 1500;

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {
    return isAny(element, [ 'bpmn:Task',  'bpmn:Event', 'bpmn:DataStoreReference', 'bpmn:TextAnnotation']) && !element.labelTarget;
  }

  drawShape(parentNode, element) {
    var typ = element.type;
    if (element.businessObject.eventDefinitions) {
      typ = element.businessObject.eventDefinitions[0].$type;
    };    
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    svgAttr(parentNode, {"type": typ});
  }

}

CustomRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ];
