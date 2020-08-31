import ParBase from './par-base'
import * as THREE from 'three'

class Realization extends ParBase {
  constructor () {
    super()
    this.scenario = null
    this.resources = {numProcs: 1}
    this.simulation = {inputFile: '', computeStatus: '', availableViewTypes: {}, views: []}
  }
  addView (payload) {
    let graphics = payload.graphics
    graphics.scene.add(payload.geometry)
    let views = this.simulation.views
    let nextID = views.length > 0 ? views[views.length - 1].viewID + 1 : 0
    this.simulation.views.push({viewID: nextID, geometryID: payload.geometry.id, viewName: payload.viewName, isVisible: true, isWireframe: false})
  }
  modifyView (payload) {
    let viewIndex = this.simulation.views.findIndex(view => view.viewID === payload.definition.viewID)
    if (viewIndex !== -1) {
      let graphics = payload.graphics
      let thisView = this.simulation.views[viewIndex]
      thisView.isWireframe = payload.definition.isWireframe
      thisView.isVisible = payload.definition.isVisible
      let geometry = graphics.scene.getObjectById(thisView.geometryID)
      geometry.visible = payload.definition.isVisible
      geometry.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: payload.definition.isWireframe,
        vertexColors: THREE.VertexColors
      })
    }
  }
  removeView (payload) {
    let viewIndex = this.simulation.views.findIndex(view => view.viewID === payload.viewID)
    if (viewIndex !== -1) {
      let graphics = payload.graphics
      graphics.scene.remove(graphics.scene.getObjectById(this.simulation.views[viewIndex].geometryID))
      this.simulation.views.splice(viewIndex, 1)
    }
  }
}

export default Realization
