import AnalyzeStaticThermomechanics from './analyze-static-thermomechanics-module'
import AnalyzeTransientThermomechanics from './analyze-transient-thermomechanics-module'
import AnalyzeStaticThermal from './analyze-static-thermal-module'
import AnalyzeTransientThermal from './analyze-transient-thermal-module'
import AnalyzeStaticMechanics from './analyze-static-mechanics-module'
import AnalyzeTransientMechanics from './analyze-transient-mechanics-module'
import ErrorHandler from '../error-handler-module'
import TeuchosParser from '../teuchos-parser-module'


class AnalyzeScenarioFactory {
  constructor () {
    this.mPhysics = new Map([
      [ 'Steady State Thermal', {code: 'Analyze', type: 'Steady State Thermal', Constructor: AnalyzeStaticThermal} ],
      [ 'Transient Thermal', {code: 'Analyze', type: 'Transient Thermal', Constructor: AnalyzeTransientThermal} ],
      [ 'Static Mechanical', {code: 'Analyze', type: 'Static Mechanical', Constructor: AnalyzeStaticMechanics} ],
      [ 'Transient Mechanical', {code: 'Analyze', type: 'Transient Mechanical', Constructor: AnalyzeTransientMechanics} ],
      [ 'Steady State Thermomechanical', {code: 'Analyze', type: 'Steady State Thermomechanical', Constructor: AnalyzeStaticThermomechanics} ],
      [ 'Transient Thermomechanical', {code: 'Analyze', type: 'Transient Thermomechanical', Constructor: AnalyzeTransientThermomechanics} ]
    ])
    this.mPDE = {
      'Thermal': {'Elliptic': 'Steady State Thermal', 'Parabolic': 'Transient Thermal'},
      'Mechanical': {'Elliptic': 'Static Mechanical', 'Hyperbolic': 'Transient Mechanical'},
      'Thermomechanical': {'Elliptic': 'Steady State Thermomechanical', 'Parabolic': 'Transient Thermomechanical'}
    }
  }
  availableScenarioTypes () {
    return this.mPhysics
  }
  createFromClass (aHostPhysics, aPDEClass) {
    return this.create(this.mPDE[aHostPhysics][aPDEClass])
  }
  create (aHostPhysics) {
    for (var [key, entry] of this.mPhysics.entries()) {
      if (key === aHostPhysics) {
        return new entry.Constructor()
      }
    }
    return null
  }
  createFromData (aData) {
    const newScenario = this.create(aData.hostPhysics)
    newScenario.fromData(aData)
    return newScenario
  }
  createFromFile (aDefinition) {
    const required = true
    const parser = new DOMParser()
    const doc = parser.parseFromString(aDefinition.data, 'text/xml')
    const teuchosParser = new TeuchosParser()
    const errorHandler = new ErrorHandler()
    errorHandler.report('file read')

    const params = teuchosParser.getParameterList(doc, 'Problem', required)
    const params_PlatoProblem = teuchosParser.getParameterList(params, 'Plato Problem', required)
    const param_Physics = teuchosParser.getParameter(params_PlatoProblem, 'Physics', required)
    const param_PDEClass = teuchosParser.getParameter(params_PlatoProblem, 'PDE Constraint', required)

    const newScenario = this.createFromClass(param_Physics, param_PDEClass)

    if (newScenario === null){
      errorHandler.report('Import failed:')
      errorHandler.report('Could not find physics of type ' + param_Physics)
      return null
    }

    newScenario.name = aDefinition.name
    newScenario.loadProblem(params)

    return newScenario
  }
}

export default AnalyzeScenarioFactory
