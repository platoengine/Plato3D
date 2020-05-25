import AnalyzeThermomechanics from './analyze-thermomechanics-module'
import AnalyzeElectromechanics from './analyze-electromechanics-module'
import AnalyzeThermal from './analyze-thermal-module'
import AnalyzeMechanics from './analyze-mechanics-module'
import AnalyzeStabilizedMechanics from './analyze-stabilized-mechanics-module'
import AnalyzeStabilizedThermomechanics from './analyze-stabilized-thermomechanics-module'
import ErrorHandler from '../error-handler-module'
import TeuchosParser from '../teuchos-parser-module'

class AnalyzeScenarioFactory {
  constructor () {
    this.mPhysics = new Map([
      [ 'Thermal', {code: 'Analyze', type: 'Thermal', Constructor: AnalyzeThermal} ],
      [ 'Mechanical', {code: 'Analyze', type: 'Mechanical', Constructor: AnalyzeMechanics} ],
      [ 'Stabilized Mechanical', {code: 'Analyze', type: 'Stabilized Mechanical', Constructor: AnalyzeStabilizedMechanics} ],
      [ 'Stabilized Thermomechanical', {code: 'Analyze', type: 'Stabilized Thermomechanical', Constructor: AnalyzeStabilizedThermomechanics} ],
      [ 'Thermomechanical', {code: 'Analyze', type: 'Thermomechanical', Constructor: AnalyzeThermomechanics} ],
      [ 'Electromechanical', {code: 'Analyze', type: 'Electromechanical', Constructor: AnalyzeElectromechanics} ]
    ])
  }
  availableScenarioTypes () {
    return this.mPhysics
  }
  create (aHostPhysics) {
    for (var [key, entry] of this.mPhysics.entries()) {
      if (key === aHostPhysics) {
        return new entry.Constructor()
      }
    }
    return null
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

    const newScenario = this.create(param_Physics)

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
