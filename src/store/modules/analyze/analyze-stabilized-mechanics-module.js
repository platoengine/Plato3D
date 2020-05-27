import AnalyzeScenarioBase from './analyze-scenario-base-module'

class AnalyzeStabilizedMechanics extends AnalyzeScenarioBase {
  constructor () {
    super()
    this.hostPhysics = 'Stabilized Mechanical'
    this.modelviews = {
      'Problem': {
        'data': null,
        'view': {
          'type': 'single-view',
          '<Template>': {
            'Physics': { type: 'string', value: 'Stabilized Mechanical', fixed: true },
            'Constraint': { type: 'string', value: '', options: () => { return this.selectables['Scalar Functions'] } },
            'Objective': { type: 'string', value: '', options: () => { return this.selectables['Scalar Functions'] } },
            'Self-Adjoint': { type: 'bool', value: 'false', options: [ 'false', 'true' ] },
            'PDE Constraint': { type: 'string', value: 'Elliptic', options: ['Elliptic'] },
            'Elliptic': {
              'Penalty Function': {
                'Type': { type: 'string', value: 'SIMP', options: ['SIMP', 'RAMP', 'Heaviside'] },
                'Exponent': { type: 'double', value: '3.0' },
                'Minimum Value': { type: 'double', value: '1.0e-3' }
              }
            }
          }
        }
      },
      'Material Model': {
        'data': {},
        'option': null,
        'view': {
          'type': 'option-view',
          '<Options>': {
            'Isotropic Linear Elastic': {
              'Poissons Ratio': { type: 'double', value: '0.33' },
              'Youngs Modulus': { type: 'double', value: '1e11' }
            },
            'Cubic Linear Elastic': {
              'C11': { type: 'double', value: '1e11' },
              'C22': { type: 'double', value: '1e11' },
              'C33': { type: 'double', value: '1e11' }
            }
          }
        }
      },
      'Scalar Functions': {
        'data': [],
        'view': {
          'type': 'list-view',
          '<Template>': {
            'Type': { type: 'string', value: 'Scalar Function', options: ['Scalar Function'] },
            'Scalar Function Type': {
              type: 'string',
              value: 'Volume',
              options: ['Volume', 'Internal Elastic Energy']
            },
            'Penalty Function': {
              'Type': { type: 'string', value: 'SIMP', options: ['SIMP', 'RAMP', 'Heaviside'] },
              'Exponent': { type: 'double', value: '3.0' },
              'Minimum Value': { type: 'double', value: '1.0e-3' }
            }
          }
        }
      },
      'Mechanical Loads': {
        'data': [],
        'view': {
          'type': 'list-view',
          '<Template>': {
            'Type': { type: 'string', value: 'Uniform', options: ['Uniform', 'Uniform Component'] },
            'Values': { type: 'double', value: {'X': '0.0', 'Y': '0.0', 'Z': '0.0'}, conditionalView: ['Type', 'Uniform'] },
            'Value': { type: 'double', value: '0.0', conditionalView: ['Type', 'Uniform Component'] },
            'Component': { type: 'string', value: 'X', options: ['X', 'Y', 'Z'], conditionalView: ['Type', 'Uniform Component'] },
            'Sides': { type: 'string', value: '', options: () => { return this.selectables['sidesets'] } }
          }
        }
      },
      'Constraints': {
        'data': [],
        'view': {
          'type': 'list-view',
          '<Template>': {
            'Type': { type: 'string', value: 'Zero Value', options: ['Zero Value', 'Fixed Value'] },
            'Index': { type: 'int', value: '0', options: ['0', '1', '2', '3'] },
            'Value': { type: 'double', value: '0.0', conditionalView: ['Type', 'Fixed Value'] },
            'Sides': { type: 'string', value: '', options: () => { return this.selectables['nodesets'] } }
          }
        }
      }
    }

    this.outputData = {
      'Problem': {
        'Physics': { type: 'string', value: 'Plato Driver' },
        'Spatial Dimension': { type: 'int', value: '3' },
        'Input Mesh': { type: 'string', value: this.geometry.body.fileName },
        'Plato Problem': {
          '(Problem)': () => { return this.getViewData('Problem') },
          'Material Model': () => { return this.getViewData('Material Model') },
          '(Scalar Functions)': () => { return this.getViewData('Scalar Functions') },
          'Mechanical Natural Boundary Conditions': () => { return this.getViewData('Mechanical Loads') },
          'Essential Boundary Conditions': () => { return this.getViewData('Constraints') }
        }
      }
    }
    this.inputData = {
      'Problem': {
        'Input Mesh': { type: 'string', value: (v) => {this.geometry.body.fileName = v} },
        'Plato Problem': {
          'Type===Scalar Function': 'Scalar Functions',
          'Material Model': 'Material Model',
          '(Essential Boundary Conditions)': 'Constraints',
          '(Natural Boundary Conditions)': 'Mechanical Loads',
          '[Plato Problem]': 'Problem'
        }
      }
    }
  }
}

export default AnalyzeStabilizedMechanics
