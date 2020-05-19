//import TeuchosParser from '../teuchos-parser-module'
import TeuchosWriter from '../teuchos-writer-module'
import ErrorHandler from '../error-handler-module'
import ParBase from '../par-base'
import XMLWriter from 'xml-writer'
import Vue from 'vue'

const errorHandler = new ErrorHandler()

class AnalyzeScenarioBase extends ParBase {
  constructor () {
    super()
    this.tw = new TeuchosWriter()
    this._type = ''
    this.hostPhysics = ''
    this.hostCode = 'Analyze'
    this.geometry = {
      body: {fileName: '', modelName: ''},
      boundaries: []
    }
    this.selectables = {}
    this.modelviews = {}
    this.inputData = {}
  }
  get type () {
    return this._type
  }
  set type (newValue) {
    this._type = newValue
  }
  getViewData (viewname) {
    let data = this.modelviews[viewname]['data']
    if (Array.isArray(data)) {
      let newView = {}
      data.forEach(arrayEntry => {
        let arrayEntryName = Object.keys(arrayEntry)[0]
        newView[arrayEntryName] = arrayEntry[arrayEntryName]
      })
      return newView
    } else {
      return data
    }
  }
  setModel (modelName, models) {
    const entryIndex = models.findIndex((m) => m.name === modelName)
    if (entryIndex !== -1) {
      const model = models[entryIndex]
      Vue.set(this.selectables, 'nodesets', [])
      Vue.set(this.selectables, 'sidesets', [])
      model.primitives.forEach(
        function (p) {
          if (p.type === 'nodeset') {
            Vue.set(this.selectables['nodesets'], this.selectables['nodesets'].length, p.definition.Name)
          }
          if (p.type === 'sideset') {
            Vue.set(this.selectables['sidesets'], this.selectables['sidesets'].length, p.definition.Name)
          }
        }, this)
      this.geometry.body.modelName = modelName
      this.geometry.body.fileName = model.fileName
    } else {
      errorHandler.report("Error:  Requested a model that doesn't exist")
    }
  }
  setOptionData (dataName, data) {
    this.modelviews[dataName]['data'] = data
  }
  setListData (dataName, data) {
    let thisData = this.modelviews[dataName]['data']
    let entryName = Object.keys(data)[0]
    if (Array.isArray(thisData)) {
      let entryIndex = thisData.findIndex((el) => { return Object.prototype.hasOwnProperty.call(el, entryName) })
      if (entryIndex !== -1) {
        this.modelviews[dataName]['data'][entryIndex] = data
        Vue.set(this.selectables[dataName], entryIndex, entryName)
      }
    }
  }
  appendListData (dataName, entryName, data) {
    // if 'entryName' is unique, add to the list
    let thisData = this.modelviews[dataName]['data']
    if (Array.isArray(thisData)) {
      let entryIndex = thisData.findIndex((el) => { return Object.prototype.hasOwnProperty.call(el, entryName) })
      if (entryIndex === -1) {
        let newEntry = {}
        newEntry[entryName] = data
        this.modelviews[dataName]['data'].push(newEntry)
        // add the new entry name to a reactive list
        if (!Object.prototype.hasOwnProperty.call(this.selectables, dataName)) {
          Vue.set(this.selectables, dataName, [])
        }
        Vue.set(this.selectables[dataName], this.selectables[dataName].length, entryName)
      } else {
        errorHandler.report('Entry names must be unique.')
      }
    }
  }
  toDOM () {
    var xw = new XMLWriter(true)
    xw.startDocument()

    let obj = {}
    this.extractDOM(this.inputData['Problem'], obj)
    this.writeObject(xw, obj, 'Problem')

    xw.endDocument()

    return xw.toString()
  }
  asWriteable (aVar) {
    if (typeof aVar === 'object' && !Array.isArray(aVar)) {
      let retVal = []
      Object.keys(aVar).forEach(k => {
        retVal.push(aVar[k])
      })
      return retVal
    } else
    if (typeof aVar === 'function') {
      return aVar()
    } else {
      return aVar
    }
  }
  extractDOM (aObjectFrom, aObjectTo) {
    Object.keys(aObjectFrom).forEach(function (key) {
      let aMember = aObjectFrom[key]
      if (this.isParameter(aMember)) {
        if (this.conditionMet(aMember, aObjectFrom)) {
          aObjectTo[key] = {}
          aObjectTo[key]['value'] = this.asWriteable(aMember['value'])
          aObjectTo[key]['type'] = aMember['type']
        }
      } else
      if (this.isFunction(aMember)) {
        aObjectTo[key] = {}
        this.extractDOM(aMember(), aObjectTo[key])
      } else
      if (this.isParameterList(aMember)) {
        if (this.conditionMet(aMember, aObjectFrom)) {
          aObjectTo[key] = {}
          this.extractDOM(aMember, aObjectTo[key])
        }
      }
    }, this)
  }
  writeObject (xw, aObject, aName) {
    let isNotList = (this.isListName(aName) === false)
    if (isNotList) {
      xw.startElement('ParameterList')
      xw.writeAttribute('name', aName)
    }
    Object.keys(aObject).forEach(function (key) {
      let aMember = aObject[key]
      if (this.isParameter(aMember)) {
        this.tw.addParameterToXML(xw, aMember.value, key, aMember.type)
      } else
      if (this.isFunction(aMember)) {
        this.writeObject(xw, aMember(), key)
      } else {
        this.writeObject(xw, aMember, key)
      }
    }, this)
    if (isNotList) {
      xw.endElement()
    }
  }
  isListName (aName) {
    return (aName.startsWith('(') && aName.endsWith(')'))
  }
  hasPropertyOfType (aVar, aName, aType) {
    if (Object.prototype.hasOwnProperty.call(aVar, aName)) {
      if (typeof aVar[aName] === aType) {
        return true
      }
    }
    return false
  }
  conditionMet (aVar, aContext) {
    if (this.hasPropertyOfType(aVar, 'conditionalView', 'object') && Array.isArray(aVar['conditionalView'])) {
      let propName = aVar['conditionalView'][0]
      let propValue = aVar['conditionalView'][1]
      if (Object.prototype.hasOwnProperty.call(aContext, propName)) {
        if (aContext[propName].value === propValue) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      return true
    }
  }
  isParameterList (aVar) {
    return typeof aVar === 'object' && !Array.isArray(aVar)
  }
  isParameter (aVar) {
    return this.hasPropertyOfType(aVar, 'type', 'string') &&
      (this.hasPropertyOfType(aVar, 'value', 'string') ||
      this.hasPropertyOfType(aVar, 'value', 'object') ||
      this.hasPropertyOfType(aVar, 'value', 'function'))
  }
  isFunction (aVar) {
    return typeof aVar === 'function'
  }
  loadJSON (graphics, scenarioData) {
    const definition = JSON.parse(scenarioData)
    this.loadNative(definition)
  }
  loadNative (definition) {
    let localKeys = Object.keys(this)
    let inputKeys = Object.keys(definition)
    if (localKeys.length !== inputKeys.length) {
      errorHandler.report('data structure mismatch. Continuing')
    }
    let error = false
    inputKeys.forEach((inputKey) => {
      let keyIndex = localKeys.findIndex(localKey => localKey === inputKey)
      if (keyIndex === -1) {
        errorHandler.report('input key \'' + inputKey + '\' not found in Scenario structure.')
        error = true
      } else {
        this[localKeys[keyIndex]] = definition[inputKey]
      }
    }, this)
    if (error === true) {
      errorHandler.report('data structure mismatch. Continuing.')
    }
  }
  //loadScenarioXML (definition) {
  //  errorHandler.report('This function isn\'t done yet.  Why are you here?')
  // let required = true
  // let parser = new DOMParser()
  // let doc = parser.parseFromString(definition.data, 'text/xml')
  // let teuchosParser = new TeuchosParser()
  // let params = teuchosParser.getParameterList(doc, '', required)
  // let problemParams = teuchosParser.getParameterList(params, 'Problem', required)
  //}
}

export default AnalyzeScenarioBase
