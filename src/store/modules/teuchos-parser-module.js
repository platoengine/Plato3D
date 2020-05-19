import ErrorHandler from './error-handler-module'

function TeuchosParser () {
  this.errorHandler = new ErrorHandler()

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
  this.parseBasis = function (params, name) {
    try {
      var originParams = this.getParameterList(params, 'Origin')
      if (originParams) {
        var X0 = this.getParameter(originParams, 'X', /* required= */ true)
        var Y0 = this.getParameter(originParams, 'Y', /* required= */ true)
        var Z0 = this.getParameter(originParams, 'Z', /* required= */ true)
      }
      var basisParams = this.getParameterList(params, 'Basis', /* required= */ true)
      if (basisParams) {
        var X = this.getParameter(basisParams, 'X Axis', /* required= */ true)
        var Y = this.getParameter(basisParams, 'Y Axis', /* required= */ true)
        var Z = this.getParameter(basisParams, 'Z Axis', /* required= */ true)
      }
    } catch (err) {
      this.errorHandler.reportAndThrow('Failed to parse \'' + name + '\' parameters')
    }
    var definition = {
      basisName: name,
      x0: X0,
      x1: X[0],
      x2: X[1],
      x3: X[2],
      y0: Y0,
      y1: Y[0],
      y2: Y[1],
      y3: Y[2],
      z0: Z0,
      z1: Z[0],
      z2: Z[1],
      z3: Z[2]
    }
    return definition
  }
  this.parsePrimitive = function (params, basis, operation) {
    var definition
    var pType = this.getParameter(params, 'Type')
    if (pType === 'Frustum') {
      try {
        var pHeight = this.getParameter(params, 'Height', /* required= */ true)
        var pRadius0 = this.getParameter(params, 'Radius0', /* required= */ true)
        var pRadius1 = this.getParameter(params, 'Radius1', /* required= */ true)
        var pAxis = this.getParameter(params, 'Axis')
      } catch (err) {
        this.errorHandler.reportAndThrow('Failed to parse \'Frustum\' parameters')
      }
      definition = {
        Type: 'Cylinder',
        Radius0: pRadius1,
        Radius1: pRadius0,
        Height: pHeight,
        Xpos: '0.0',
        Ypos: '0.0',
        Zpos: '0.0',
        basisName: basis,
        Operation: (operation === 'Add' ? 'add' : 'subtract'),
        axis: pAxis
      }
    } else
    if (pType === 'Cylinder') {
      try {
        var pCylHeight = this.getParameter(params, 'Height', /* required= */ true)
        var pCylRadius = this.getParameter(params, 'Radius', /* required= */ true)
        var pCylAxis = this.getParameter(params, 'Axis')
      } catch (err) {
        this.errorHandler.reportAndThrow('Failed to parse \'Cylinder\' parameters')
      }
      definition = {
        Type: 'Cylinder',
        Radius0: pCylRadius,
        Radius1: pCylRadius,
        Height: pCylHeight,
        Xpos: '0.0',
        Ypos: '0.0',
        Zpos: '0.0',
        basisName: basis,
        Operation: (operation === 'Add' ? 'add' : 'subtract'),
        axis: pCylAxis
      }
    } else
    if (pType === 'Brick') {
      try {
        var pX = this.getParameter(params, 'X Dimension', /* required= */ true)
        var pY = this.getParameter(params, 'Y Dimension', /* required= */ true)
        var pZ = this.getParameter(params, 'Z Dimension', /* required= */ true)
      } catch (err) {
        this.errorHandler.reportAndThrow('Failed to parse \'Brick\' parameters')
      }
      definition = {
        Type: 'Cube',
        Xdim: pX,
        Ydim: pY,
        Zdim: pZ,
        Xpos: '0.0',
        Ypos: '0.0',
        Zpos: '0.0',
        basisName: basis,
        Operation: (operation === 'Add' ? 'add' : 'subtract')
      }
    } else
    if (pType === 'Torus') {
      try {
        var pTorusRadius0 = this.getParameter(params, 'Major Radius', /* required= */ true)
        var pTorusRadius1 = this.getParameter(params, 'Minor Radius', /* required= */ true)
        var pTorusAxis = this.getParameter(params, 'Axis')
      } catch (err) {
        this.errorHandler.reportAndThrow('Failed to parse \'Torus\' parameters')
      }
      definition = {
        Type: 'Torus',
        Radius0: pTorusRadius0,
        Radius1: pTorusRadius1,
        Xpos: '0.0',
        Ypos: '0.0',
        Zpos: '0.0',
        basisName: basis,
        Operation: (operation === 'Add' ? 'add' : 'subtract'),
        axis: (pTorusAxis !== null) ? pTorusAxis : 'Z'
      }
    } else
    if (pType === 'Sphere') {
      var pSphereRadius = this.getParameter(params, 'Radius')
      definition = {
        Type: 'Sphere',
        Radius: pSphereRadius,
        Xpos: '0.0',
        Ypos: '0.0',
        Zpos: '0.0',
        basisName: basis,
        Operation: (operation === 'Add' ? 'add' : 'subtract'),
        axis: pTorusAxis
      }
    }
    return definition
  }
}

export default TeuchosParser
