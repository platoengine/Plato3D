import AnalyzeScenarioBase from './analyze-scenario-base-module'

class AnalyzeElectromechanics extends AnalyzeScenarioBase {
  constructor () {
    super()
    this.hostPhysics = 'Electromechanics'
    this.modelviews = {
      'Problem': {
        'data': {},
        'view': {
          'type': 'single-view',
          '<Template>': {
            'Physics': { type: 'string', value: 'Electromechanical', fixed: true },
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
        'view': {
          'type': 'option-view',
          '<Options>': {
            'Isotropic Linear Electroelastic': {
              'Poissons Ratio': { type: 'double', value: '0.33' },
              'Youngs Modulus': { type: 'double', value: '1e11' },
              'p11': { type: 'double', value: '1.0e-10' },
              'p33': { type: 'double', value: '1.4e-10' },
              'e33': { type: 'double', value: '15.8' },
              'e31': { type: 'double', value: '-5.4' },
              'e15': { type: 'double', value: '12.3' },
              'Alpha': { type: 'double', value: '1e10' }
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
              options: ['Volume', 'Internal Electroelastic Energy', 'Stress P-Norm']
            },
            'Exponent': { type: 'double', value: '6.0', conditionalView: ['Scalar Function Type', 'Stress P-Norm'] },
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
            'Sides': { type: 'string', value: '', options: this.geometry.boundaries }
          }
        }
      },
      'Thermal Loads': {
        'data': [],
        'view': {
          'type': 'list-view',
          '<Template>': {
            'Type': { type: 'string', value: 'Uniform', options: ['Uniform'] },
            'Value': { type: 'double', value: '0.0' },
            'Sides': { type: 'string', value: '', options: this.geometry.boundaries }
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
            'Sides': { type: 'string', value: '', options: this.geometry.boundaries }
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
          'Thermal Natural Boundary Conditions': () => { return this.getViewData('Thermal Loads') },
          'Essential Boundary Conditions': () => { return this.getViewData('Constraints') }
        }
      }
    }
  }
}

export default AnalyzeElectromechanics
