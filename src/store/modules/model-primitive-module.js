function ModelPrimitive () {
  this.basis = null
  this.type = ''
  this.definition = {Name: '', ID: -1, Type: 'Faceted', Operation: 'add'}
  this.primitiveObject = {}
  this.displayAttributes = { opacity: 1.0, wireframe: false, visible: true }
}

export default ModelPrimitive
