class ParBase {
  constructor () {
    this.name = ''
    this.type = ''
    this.description = ''
    this.definition = ''
    this.requires = []
    this.accepts = []
    this.provides = []
    this.state = []
    this.remote = {}
    this.parameters = []
  }
  importData (data) {
    // these are the keys that will be imported.
    const destKeys = [
      'name',
      'type',
      'description',
      'definition',
      'requires',
      'accepts',
      'provides',
      'state', 
      'remote',
      'parameters'
    ]

    Object.keys(data).forEach(key => {
      if (destKeys.find(destKey => destKey === key)) {
        this[key] = data[key]
      }
    })
  }
}
export default ParBase
