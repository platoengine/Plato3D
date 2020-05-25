import ErrorHandler from './error-handler-module'

function TeuchosParser () {
  this.errorHandler = new ErrorHandler()

  this.getParameterLists = function (node) {
    var returnNodes = []
    for (let iChild = 0; iChild < node.childNodes.length; iChild++) {
      let child = node.childNodes[iChild]
      if (child.nodeName === 'ParameterList') {
        returnNodes.push(child)
      }
    }
    return returnNodes
  }
  this.getName = function (plist) {
    if (plist.nodeName === 'ParameterList') {
      return plist.getAttribute('name')
    }
    return null
  }
  this.toObject = function (fromList) {
    let retObject = {}
    this.toObjectFromChild(retObject, fromList)
    return retObject
  }
  this.toObjectFromChild = function (toObject, fromChild) {
    let recObject = toObject
    if (fromChild.nodeName === 'ParameterList') {
      let key = fromChild.getAttribute('name')
      toObject[key] = {}
      recObject = toObject[key]
    }
    for (let iChild = 0; iChild < fromChild.childNodes.length; iChild++) {
      let child = fromChild.childNodes[iChild]
      if (child.nodeName === 'ParameterList') {
        this.toObjectFromChild(recObject, child)
      } else {
        this.toObjectFromParameter(recObject, child)
      }
    }
  }
  this.toObjectFromParameter = function (toObject, fromChild) {
    if (fromChild.nodeName === 'Parameter') {
      let key = fromChild.getAttribute('name')
      toObject[key] = {}
      toObject[key]['value'] = fromChild.getAttribute('value')
      toObject[key]['type'] = fromChild.getAttribute('type')
    }
  }
  this.getParameterList = function (node, listName = '', required = false) {
    var returnNode = null
    if (listName === '') {
      for (let iChild = 0; iChild < node.childNodes.length; iChild++) {
        let child = node.childNodes[iChild]
        if (child.nodeName === 'ParameterList') {
          returnNode = child
        }
      }
    } else {
      for (let iChild = 0; iChild < node.childNodes.length; iChild++) {
        let child = node.childNodes[iChild]
        if (child.nodeName === 'ParameterList' && child.getAttribute('name') === listName) {
          returnNode = child
        }
      }
    }
    if (required && returnNode === null) {
      this.errorHandler.reportAndThrow('Could not find ParameterList: ' + listName)
    }
    return returnNode
  }
  this.isParameter = function (node, paramName) {
    for (var iChild = 0; iChild < node.childNodes.length; iChild++) {
      var child = node.childNodes[iChild]
      if (child.nodeName === 'Parameter' && child.getAttribute('name') === paramName) {
        return true
      }
    }
    return false
  }
  this.isParameterList = function (node, paramName) {
    for (var iChild = 0; iChild < node.childNodes.length; iChild++) {
      var child = node.childNodes[iChild]
      if (child.nodeName === 'ParameterList' && child.getAttribute('name') === paramName) {
        return true
      }
    }
    return false
  }
  this.getParameter = function (node, paramName, required = false) {
    var returnValue
    var returnType
    for (var iChild = 0; iChild < node.childNodes.length; iChild++) {
      var child = node.childNodes[iChild]
      if (child.nodeName === 'Parameter' && child.getAttribute('name') === paramName) {
        returnValue = child.getAttribute('value')
        returnType = child.getAttribute('type')
      }
    }
    if (returnType === 'bool') {
      if (returnValue === 'true') {
        return true
      } else
      if (returnValue === 'false') {
        return false
      }
    } else
    if (returnType === 'string') {
      return returnValue
    } else
    if (returnType === 'double') {
      return parseFloat(returnValue)
    } else
    if (returnType === 'int') {
      return parseInt(returnValue)
    } else
    if (returnType === 'Array(int)') {
      return returnValue.replace('{', '').replace('}', '').split(',').map(x => parseInt(x))
    } else
    if (returnType === 'Array(double)') {
      return returnValue.replace('{', '').replace('}', '').split(',').map(x => parseFloat(x))
    } else
    if (returnType === 'Array(string)') {
      return returnValue.replace('{', '').replace('}', '').split(',')
    } else
    if (returnType === 'Array(bool)') {
      return returnValue.replace('{', '').replace('}', '').split(',').map(x => (x === 'true'))
    }
    if (required) {
      this.errorHandler.reportAndThrow('Could not parse Parameter: ' + paramName)
    }
    return null
  }
}

export default TeuchosParser
