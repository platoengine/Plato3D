import * as THREE from 'three'
import ModelPrimitive from './model-primitive-module'
import ParBase from './par-base'

class ExodusModel extends ParBase {
  constructor () {
    super()
    this.displayAttributes = { opacity: 1.0, wireframe: false, visible: true }

    this.primitives = []

    this.type = 'ExodusModel'
  }

  range () {
    return []
  }

  importData (modelData) {
    super.importData(modelData)
    this.displayAttributes = modelData.displayAttributes
  }

  addPrimitive (payload) {
    const graphics = payload.graphics
    // 'name' is the relative path on the server.  The file base name must be extracted
    let name = payload.name.split('/').pop().split('.')[0]
    let geometry = payload.geometry
    geometry.children.forEach(function (kid) {
      kid.material.side = THREE.DoubleSide
    })
    let type = payload.type
    let newPrimitive = new ModelPrimitive()
    newPrimitive.definition.Name = name
    newPrimitive.primitiveObjectID = geometry.id
    newPrimitive.type = type
    graphics.scene.add(geometry)
    this.primitives.push(newPrimitive)
    graphics.setBoundingBox(this.primitives)
  }

  // loadExodus (graphics, modelData) {
  // }
  destructor (graphics) {
    this.primitives.forEach(function (primitive) {
      graphics.scene.remove(graphics.scene.getObjectById(primitive.primitiveObjectID))
    })
    this.primitives.length = 0
    this.globalBasis = null
  }
  // loadModel (graphics, modelData) {
  // }
  setDisplayAttributes (payload) {
    const graphics = payload.graphics
    const itemDisplayAttributes = payload.attributes
    const thisPrimitive = payload.primitive
    thisPrimitive.displayAttributes.opacity = itemDisplayAttributes.opacity
    thisPrimitive.displayAttributes.wireframe = itemDisplayAttributes.wireframe
    thisPrimitive.displayAttributes.visible = itemDisplayAttributes.visible
    var opacity = thisPrimitive.displayAttributes.opacity * this.displayAttributes.opacity
    let wireframe = itemDisplayAttributes.wireframe
    let visible = itemDisplayAttributes.visible
    const primitiveObject = graphics.scene.getObjectById(thisPrimitive.primitiveObjectID)
    var restoreColor = primitiveObject.children[0].material.color.getHex()
    primitiveObject.children.forEach(function (kid) {
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
  setModelAttributes (modelAttributes) {
    this.name = modelAttributes.name
    if( modelAttributes.description != null ){
      this.description = modelAttributes.description
    }
  }
}

export default ExodusModel
