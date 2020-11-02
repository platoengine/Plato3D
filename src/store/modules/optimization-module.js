import ParBase from './par-base'
//import * as THREE from 'three'

class Optimization extends ParBase {
  constructor () {
    super()
    this.resources = {numProcs: 1}
    this.objectives = []
    this.constraints = []
    this.simulation = {inputFile: '', computeStatus: '', availableViewTypes: {}, views: []}
  }
  addObjective(scenario, criterionName, weight) {
    this.objectives.push({scenario: scenario, criterionName: criterionName, weight: weight}) 
  }
  addConstraint(scenario, criterionName, target) {
    this.constraints.push({scenario: scenario, criterionName: criterionName, target: target}) 
  }
//  addView (payload) {
//    let graphics = payload.graphics
//    graphics.scene.add(payload.geometry)
//    let views = this.simulation.views
//    let nextID = views.length > 0 ? views[views.length - 1].viewID + 1 : 0
//    this.simulation.views.push({viewID: nextID, geometryID: payload.geometry.id, viewName: payload.viewName, isVisible: true, isWireframe: false})
//  }
//  modifyView (payload) {
//    let viewIndex = this.simulation.views.findIndex(view => view.viewID === payload.definition.viewID)
//    if (viewIndex !== -1) {
//      let graphics = payload.graphics
//      let thisView = this.simulation.views[viewIndex]
//      thisView.isWireframe = payload.definition.isWireframe
//      thisView.isVisible = payload.definition.isVisible
//      let geometry = graphics.scene.getObjectById(thisView.geometryID)
//      geometry.visible = payload.definition.isVisible
//      geometry.material = new THREE.MeshBasicMaterial({
//        color: 0xffffff,
//        wireframe: payload.definition.isWireframe,
//        vertexColors: THREE.VertexColors
//      })
//    }
//  }
//  removeView (payload) {
//    let viewIndex = this.simulation.views.findIndex(view => view.viewID === payload.viewID)
//    if (viewIndex !== -1) {
//      let graphics = payload.graphics
//      graphics.scene.remove(graphics.scene.getObjectById(this.simulation.views[viewIndex].geometryID))
//      this.simulation.views.splice(viewIndex, 1)
//    }
//  }
}

export default Optimization
