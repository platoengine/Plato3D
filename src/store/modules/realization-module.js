import ParBase from './par-base'
import * as THREE from 'three'

class Realization extends ParBase {
  constructor () {
    super()
    this.scenario = null
    this.resources = {numProcs: 1}
    this.simulation = {inputFile: '', computeStatus: '', availableViewTypes: {}, views: []}
  }
  addView (graphics, payload) {
    graphics.scene.add(payload.geometry)
    let views = this.simulation.views
    let nextID = views.length > 0 ? views[views.length - 1].viewID + 1 : 0
    this.simulation.views.push({viewID: nextID, geometry: payload.geometry, viewName: payload.viewName, isVisible: true, isWireframe: false})
  }
  modifyView (graphics, payload) {
    let viewIndex = this.simulation.views.findIndex(view => view.viewID === payload.definition.viewID)
    if (viewIndex !== -1) {
      let thisView = this.simulation.views[viewIndex]
      thisView.isWireframe = payload.definition.isWireframe
      thisView.isVisible = payload.definition.isVisible
      thisView.geometry.visible = payload.definition.isVisible
      thisView.geometry.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: payload.definition.isWireframe,
        vertexColors: THREE.VertexColors
      })
    }
  }
  removeView (graphics, payload) {
    let viewIndex = this.simulation.views.findIndex(view => view.viewID === payload.viewID)
    if (viewIndex !== -1) {
      graphics.scene.remove(this.simulation.views[viewIndex].geometry)
      this.simulation.views.splice(viewIndex, 1)
    }
  }
}

export default Realization
