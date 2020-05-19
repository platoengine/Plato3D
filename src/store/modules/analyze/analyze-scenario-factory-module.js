import AnalyzeThermomechanics from './analyze-thermomechanics-module'
import AnalyzeElectromechanics from './analyze-electromechanics-module'
import AnalyzeThermal from './analyze-thermal-module'
import AnalyzeMechanics from './analyze-mechanics-module'
import AnalyzeStabilizedMechanics from './analyze-stabilized-mechanics-module'
import AnalyzeStabilizedThermomechanics from './analyze-stabilized-thermomechanics-module'

class AnalyzeScenarioFactory {
  constructor () {
    this.mPhysics = new Map([
      [ 'Thermal', {code: 'Analyze', type: 'Thermal', Constructor: AnalyzeThermal} ],
      [ 'Mechanics', {code: 'Analyze', type: 'Mechanics', Constructor: AnalyzeMechanics} ],
      [ 'Stabilized Mechanics', {code: 'Analyze', type: 'Stabilized Mechanics', Constructor: AnalyzeStabilizedMechanics} ],
      [ 'Stabilized Thermomechanics', {code: 'Analyze', type: 'Stabilized Thermomechanics', Constructor: AnalyzeStabilizedThermomechanics} ],
      [ 'Thermomechanics', {code: 'Analyze', type: 'Thermomechanics', Constructor: AnalyzeThermomechanics} ],
      [ 'Electromechanics', {code: 'Analyze', type: 'Electromechanics', Constructor: AnalyzeElectromechanics} ]
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
}

export default AnalyzeScenarioFactory
