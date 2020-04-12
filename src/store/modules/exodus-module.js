import * as THREE from 'three'
import ModelPrimitive from './model-primitive-module'
import ParBase from './par-base'

class ExodusModel extends ParBase {
  constructor () {
    super()
    this.displayAttributes = { opacity: 1.0, wireframe: false, visible: true }

    this.primitives = []

    this._type = 'ExodusModel'
  }

  range () {
    return []
  }

  addPrimitive (graphics, payload) {
    // 'name' is the relative path on the server.  The file base name must be extracted
    let name = payload.name.split('/').pop().split('.')[0]
    let geometry = payload.geometry
    geometry.children.forEach(function (kid) {
      kid.material.side = THREE.DoubleSide
    })
    let type = payload.type
    let newPrimitive = new ModelPrimitive()
    newPrimitive.definition.Name = name
    newPrimitive.primitiveObject = geometry
    newPrimitive.type = type
    graphics.scene.add(geometry)
    this.primitives.push(newPrimitive)
  }

  // loadExodus (graphics, modelData) {
  // }
  clearModel (graphics) {
    this.primitives.forEach(function (primitive) {
      graphics.scene.remove(graphics.scene.getObjectById(primitive.primitiveObject.id))
    })
    this.primitives.length = 0
    this.globalBasis = null
  }
  // loadModel (graphics, modelData) {
  // }
  setDisplayAttributes (itemDisplayAttributes) {
    let thisPrimitive = itemDisplayAttributes.primitive
    thisPrimitive.displayAttributes.opacity = itemDisplayAttributes.opacity
    thisPrimitive.displayAttributes.wireframe = itemDisplayAttributes.wireframe
    thisPrimitive.displayAttributes.visible = itemDisplayAttributes.visible
    var opacity = thisPrimitive.displayAttributes.opacity * this.displayAttributes.opacity
    let wireframe = itemDisplayAttributes.wireframe
    let visible = itemDisplayAttributes.visible
    var restoreColor = thisPrimitive.definition.Operation === 'add' ? 0x00ff00 : 0xff0000
    thisPrimitive.primitiveObject.children.forEach(function (kid) {
      kid.material = new THREE.MeshPhysicalMaterial({
        color: restoreColor,
        transparent: true,
        opacity: opacity,
        wireframe: wireframe
      })
      kid.visible = visible
      kid.material.side = THREE.DoubleSide
    })
  }
}

export default ExodusModel
