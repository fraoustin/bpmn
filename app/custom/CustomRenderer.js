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
    return isAny(element, [ 'bpmn:Task',  'bpmn:Event', 'bpmn:DataStoreReference', 'bpmn:TextAnnotation', 'bpmn:Association', 'bpmn:SequenceFlow']) && !element.labelTarget;
  }

  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    svgAttr(parentNode, {"type": element.type});
    if (element.businessObject.eventDefinitions) {
      svgAttr(parentNode, {"typedef" : element.businessObject.eventDefinitions[0].$type});
    };    
 
  }

  drawConnection(parentNode, element){
    console.log(element)
    const connection = this.bpmnRenderer.drawConnection(parentNode, element);
    svgAttr(parentNode, {"type": element.type});
    if (element.businessObject.eventDefinitions) {
      svgAttr(parentNode, {"typedef" : element.businessObject.eventDefinitions[0].$type});
    };    
    if (element.businessObject.sourceRef) {
      svgAttr(parentNode, {"typesrc" : element.businessObject.sourceRef.$type});
    };    
    if (element.businessObject.targetRef) {
      svgAttr(parentNode, {"typetarget" : element.businessObject.targetRef.$type});
    };    
  
  }
}

CustomRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ];
