import TeuchosParser from '../teuchos-parser-module'
import TeuchosWriter from '../teuchos-writer-module'
import ErrorHandler from '../error-handler-module'
import {dynamicCopy, staticCopy} from '../../../components/ui/ByValue'
import ParBase from '../par-base'
import XMLWriter from 'xml-writer'
import Vue from 'vue'

const errorHandler = new ErrorHandler()

class AnalyzeScenarioBase extends ParBase {
  constructor () {
    super()
    this.tw = new TeuchosWriter()
    this.tp = new TeuchosParser()
    this.type = ''
    this.hostPhysics = ''
    this.hostCode = 'Analyze'
    this.geometry = {
      body: {fileName: '', modelName: ''},
      boundaries: []
    }
    this.selectables = {}
    this.modelviews = {}
    this.outputData = {}
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
      Vue.set(this.selectables, 'blocks', [])
      Vue.set(this.selectables, 'nodesets', [])
      Vue.set(this.selectables, 'sidesets', [])
      model.primitives.forEach(
        function (p) {
          if (p.type === 'block') {
            Vue.set(this.selectables['blocks'], this.selectables['blocks'].length, p.definition.Name)
          } else
          if (p.type === 'nodeset') {
            Vue.set(this.selectables['nodesets'], this.selectables['nodesets'].length, p.definition.Name)
          } else
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
    this.extractDOM(this.outputData['Problem'], obj)
    this.writeObject(xw, obj, 'Problem')

    xw.endDocument()

    return xw.toString()
  }
  asWriteable (aVar) {
    if (typeof aVar === 'object' && !Array.isArray(aVar)) {
      let retVal = []
      Object.keys(aVar).forEach(k => {
        const keyTokens = k.split('|')
        if (keyTokens.length === 2) {
          if (keyTokens[0] === 'checkbox') {
            const valTokens = aVar[k].split('|')
            if (valTokens[0] === 'true') {
              retVal.push(valTokens[1])
            }
          }
        } else {
          retVal.push(aVar[k])
        }
      })
      return retVal
    } else
    if (typeof aVar === 'function') {
      return aVar()
    } else {
      return aVar
    }
  }
  getAlias (aObject, aDefault) {
    if (this.hasPropertyOfType(aObject, 'alias', 'string') ) {
      return aObject['alias']
    } else
    {
      return aDefault
    }
  }
  extractDOM (aObjectFrom, aObjectTo) {
    if (aObjectFrom === null) return
    Object.keys(aObjectFrom).forEach(function (key) {
      let aMember = aObjectFrom[key]
      if (this.isParameter(aMember)) {
        if (this.conditionMet(aMember, aObjectFrom) && this.isWriteable(aMember) && this.asWriteable(aMember['value']) != "") {
          const actualKey = this.getAlias(aMember, key)
          aObjectTo[actualKey] = {}
          aObjectTo[actualKey]['value'] = this.asWriteable(aMember['value'])
          aObjectTo[actualKey]['type'] = aMember['type']
        }
      } else
      if (this.isFunction(aMember)) {
        if (!this.isEmptyObject(aMember())) {
          aObjectTo[key] = {}
          this.extractDOM(aMember(), aObjectTo[key])
        }
      } else
      if (this.isObject(aMember)) {
        if (this.conditionMet(aMember, aObjectFrom)) {
          const actualKey = this.getAlias(aMember, key)
          aObjectTo[actualKey] = {}
          this.extractDOM(aMember, aObjectTo[actualKey])
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
  isEmptyObject (aVar) {
    return (JSON.stringify(aVar) === JSON.stringify({}))
  }
  isWriteable (aVar) {
    if (this.hasPropertyOfType (aVar, 'noWrite', 'boolean')) {
      return !aVar.noWrite
    } else {
      return true
    }
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
    if (this.isConditional(aVar)) {
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
  isObject (aVar) {
    return typeof aVar === 'object' && !Array.isArray(aVar)
  }
  isParameter (aVar) {
    return this.hasPropertyOfType(aVar, 'type', 'string') &&
      (this.hasPropertyOfType(aVar, 'value', 'string') ||
      this.hasPropertyOfType(aVar, 'value', 'object') ||
      this.hasPropertyOfType(aVar, 'value', 'function'))
  }
  isInputParameter (aVar) {
    return this.hasPropertyOfType(aVar, 'type', 'string') &&
      this.hasPropertyOfType(aVar, 'value', 'function')
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
  loadProblem (params) {
    this.fromDOM(this.inputData['Problem'], params)
  }
  fromDOM (dataMap, domParams) {
    const tp = this.tp
    Object.keys(dataMap).forEach(function (key) {
      let dataBranch = dataMap[key]
      if (this.isInputParameter(dataBranch)) {
        const fromData = tp.getParameter(domParams, key, true)
        dataBranch['value'](fromData)
      } else
      if (this.isObject(dataBranch)) {
        const fromList = tp.getParameterList(domParams, key, true)
        this.fromDOM(dataBranch, fromList)
      } else {
        this.addToModelViews(dataBranch, this.getParameterLists(domParams, key))
      }
    }, this)
  }
  getParameterLists (domParams, key) {
    var pLists = []
    if (key.indexOf("===") !== -1) {
      const keys = key.split('===')
      const paramName = keys[0].trim()
      const paramValue = keys[1].trim()
      const lists = this.tp.getParameterLists(domParams)
      lists.forEach((p) => {
        if (this.tp.isParameter(p, paramName)) {
          const val = this.tp.getParameter(p, paramName)
          if (val === paramValue) {
            pLists.push(p)
          }
        }
      }, this)
    } else
    if (this.isListName(key)) {
      let trimmedKey = key.replace('(','').replace(')','')
      let thisList = this.tp.getParameterList(domParams, trimmedKey, false)
      if (thisList !== null) {
        pLists = this.tp.getParameterLists(thisList)
      }
    } else
    if (key.startsWith('[') && key.endsWith(']')) {
      pLists.push(domParams)
    } else {
      pLists.push(this.tp.getParameterList(domParams, key, true))
    }
    return pLists
  }
  syncObjects (fromObject, toObject) {
    Object.keys(fromObject).forEach( (key) => {
      let value = fromObject[key]
      if (typeof value === 'string') {
        if (value.startsWith('{') && value.endsWith('}')  &&
            this.hasPropertyOfType(toObject, key, 'object')) {
            // found a list of values (i.e., {val1, val2, ...}
            let listString = value.replace('{','').replace('}','')
            let listEntries = listString.split(',')
            const toKeys = Object.keys(toObject[key])
            if (toKeys.length > 0) {
              const firstKey = toKeys[0]
              const tokens = firstKey.split('|')
              // is it a checkbox list?
              if (tokens.length === 2 && tokens[0] === 'checkbox') {
                toKeys.forEach( (toKey) => {
                  // find matching entry in listEntries, if present
                  const toValTokens = toObject[key][toKey].split('|')
                  const valName = toValTokens[1]
                  const entryIndex = listEntries.findIndex( el => el === valName )
                  if (entryIndex !== -1) {
                    toObject[key][toKey] = 'true|' + valName
                  } else {
                    toObject[key][toKey] = 'false|' + valName
                  }
                })
              } else { // standard list (i.e., not a checkbox list)
                toKeys.forEach( (toKey, i) => {
                  toObject[key][toKey] = listEntries[i].trim()
                })
              }
            }
        } else
        if (this.hasPropertyOfType(toObject, key, 'string')) {
          if (value.startsWith('Array(') && value.endsWith(')')) {
             value = value.replace('Array(','').replace(')','')
          }
          toObject[key] = value
        }
      } else
      if (this.isObject(value)) {
        
        let toSub = null
        // is this object in the target?
        if (this.hasPropertyOfType(toObject, key, 'object')) {
          toSub = toObject[key]
        } else {
          toSub = this.getConditionalSub(fromObject, toObject, key)
        }

        if (toSub) {
          this.syncObjects(value, toSub)

          // If the target object specifies a 'conditionalValue', then find the 
          // member datum that is conditional and set the value. 
          if (this.hasPropertyOfType(toSub, 'conditionalValue', 'object')) {
            const target = toSub['conditionalValue'][0]
            const cvalue = toSub['conditionalValue'][1]
            if (this.hasPropertyOfType(toObject, target, 'object')) {
              if (this.hasPropertyOfType(toObject[target], 'value', 'string')) {
                toObject[target]['value'] = cvalue
              }
            }
          }
        }
      }
    })
  }
  isConditional(aVar) {
    if (this.hasPropertyOfType(aVar, 'conditionalView', 'object') && Array.isArray(aVar['conditionalView'])) {
      return true
    } else {
      return false
    }
  }
  getConditionalSub (tFromObject, tToObject, tKey) {
    let keys = Object.keys(tToObject)
    for (let key of keys) {
      let tokens = key.split('|')
      if (tokens.length === 2) {
        if (tokens[0] === tKey) {
          // check the condition 
          let tVar = tToObject[key]
          if (this.isConditional(tVar)) {
            let propName = tVar['conditionalView'][0]
            let propValue = tVar['conditionalView'][1]
            if (this.hasPropertyOfType(tFromObject, propName, 'object') && tFromObject[propName]['value'] === propValue) {
              return tToObject[key]
            } else
            if (this.hasPropertyOfType(tToObject, propName, 'object') && tToObject[propName]['value'] === propValue) {
              return tToObject[key]
            }
          }
        }
      }
    }
    return null
  }
  addToModelViews (dataBranch, fromLists) {
    fromLists.forEach( (p) => {
      if (this.modelviews[dataBranch]['view']['type'] === 'option-view') {
        let options = this.modelviews[dataBranch]['view']['<Options>']
        let foundOption = null
        Object.keys(options).forEach( (option) => {
          if (this.tp.isObject(p, option)) {
            foundOption = this.tp.getParameterList(p, option)
          }
        }, this)
        if (foundOption === null) {
          errorHandler.report("Error:  Requested a model that doesn't exist")
        }
        errorHandler.report("Found requested model")
        let optionDataObject = this.tp.toObject(foundOption)
        let optionDataName = this.tp.getName(foundOption)
        this.modelviews[dataBranch]['view']['<Options>'][optionDataName] = optionDataObject[optionDataName]
        this.modelviews[dataBranch]['option'] = optionDataName
      } else
      if (this.modelviews[dataBranch]['view']['type'] === 'list-view') {
        let inputListDataObject = this.tp.toObject(p)
        let inputListDataName = this.tp.getName(p)
        let templateListDataObject = {}
        templateListDataObject[inputListDataName] = {}
        staticCopy(this.modelviews[dataBranch]['view']['<Template>'], templateListDataObject[inputListDataName])
        this.syncObjects(inputListDataObject, templateListDataObject)
        let dynamicListDataObject = {}
        dynamicCopy(templateListDataObject, dynamicListDataObject)
        this.appendListData(dataBranch, inputListDataName, dynamicListDataObject[inputListDataName])
      } else
      if (this.modelviews[dataBranch]['view']['type'] === 'single-view') {
        let inputSingleViewObject = this.tp.toObject(p)
        let inputSingleViewName = this.tp.getName(p)
        let templateSingleViewObject = {}
        staticCopy(this.modelviews[dataBranch]['view']['<Template>'], templateSingleViewObject)
        this.syncObjects(inputSingleViewObject[inputSingleViewName], templateSingleViewObject)
        let dynamicSingleViewObject = {}
        dynamicCopy(templateSingleViewObject, dynamicSingleViewObject)
        this.modelviews[dataBranch]['data'] = dynamicSingleViewObject
      }
    }, this)
  }
}

export default AnalyzeScenarioBase
