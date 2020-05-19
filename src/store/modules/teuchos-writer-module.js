function TeuchosWriter () {
  this.addParameterToXML = function (writer, entry, name, type = 'not specified') {
    var isArray = false
    if (Array.isArray(entry)) {
      isArray = true
      if (entry.length === 0) {
        return
      }
    }
    writer.startElement('Parameter')
    writer.writeAttribute('name', name)
    if (type === 'not specified') {
      var item = entry
      if (isArray) {
        item = entry[0]
      }
      if (typeof item === 'number') {
        if (item % 1 === 0) {
          type = 'int'
        } else {
          type = 'double'
        }
      } else
      if (typeof item === 'string') {
        type = 'string'
      } else
      if (typeof item === 'boolean') {
        type = 'bool'
      }
    }
    writer.writeAttribute('type', isArray ? 'Array(' + type + ')' : type)
    writer.writeAttribute('value', isArray ? '{' + entry.toString() + '}' : entry.toString())
    writer.endElement()
  }

  this.addParameterListToXML = function (writer, entry) {
    let keys = Object.keys(entry)
    let values = Object.values(entry)
    for (let i = 0; i < values.length; i++) {
      let isArray = Array.isArray(values[i])
      if (isArray === false) {
        writer.startElement('ParameterList')
        writer.writeAttribute('name', keys[i])
        this.addParameterListToXML(writer, values[i])
        writer.endElement()
      } else {
        this.addParameterToXML(writer, values[i][1], keys[i], values[i][0])
      }
    }
  }
}

export default TeuchosWriter
