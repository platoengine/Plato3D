import AnalyzeScenarioBase from './analyze-scenario-base-module'

class AnalyzeThermal extends AnalyzeScenarioBase {
  constructor () {
    super()
    this.hostPhysics = 'Thermal'
    this.modelviews = {
      'Problem': {
        'data': null,
        'view': {
          'type': 'single-view',
          '<Template>': {
            'Physics': { type: 'string', value: 'Thermal', fixed: true },
            'Constraint': { type: 'string', value: '', options: () => { return this.selectables['Scalar Functions'] } },
            'Objective': { type: 'string', value: '', options: () => { return this.selectables['Scalar Functions'] } },
            'Self-Adjoint': { type: 'bool', value: 'false', options: [ 'false', 'true' ] },
            'PDE Constraint': { type: 'string', value: 'Elliptic', options: ['Elliptic', 'Parabolic'] },
            'Elliptic': {
              'Penalty Function': {
                'Type': { type: 'string', value: 'SIMP', options: ['SIMP', 'RAMP', 'Heaviside'] },
                'Exponent': { type: 'double', value: '3.0' },
                'Minimum Value': { type: 'double', value: '1.0e-3' }
              },
              conditionalView: ['PDE Constraint', 'Elliptic']
            },
            'Parabolic': {
              'Penalty Function': {
                'Type': { type: 'string', value: 'SIMP', options: ['SIMP', 'RAMP', 'Heaviside'] },
                'Exponent': { type: 'double', value: '3.0' },
                'Minimum Value': { type: 'double', value: '1.0e-3' }
              },
              conditionalView: ['PDE Constraint', 'Parabolic']
            },
            'Time Integration': {
              'Trapezoid Alpha': { type: 'double', value: '0.5'},
              'Number Time Steps': { type: 'int', value: '10' },
              'Time Step': { type: 'double', value: '1e-6' },
              conditionalView: ['PDE Constraint', 'Parabolic']
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
            'Isotropic Linear Thermal': {
              'Conductivity Coefficient': { type: 'double', value: '210.0' },
              'Specific Heat': { type: 'double', value: '900.0' },
              'Mass Density': { type: 'double', value: '2703.0' }
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
              options: ['Volume', 'Internal Thermal Energy', 'Flux P-Norm']
            },
            'Exponent': { type: 'double', value: '6.0', conditionalView: ['Scalar Function Type', 'Flux P-Norm'] },
            'Penalty Function': {
              'Type': { type: 'string', value: 'SIMP', options: ['SIMP', 'RAMP', 'Heaviside'] },
              'Exponent': { type: 'double', value: '3.0' },
              'Minimum Value': { type: 'double', value: '1.0e-3' }
            }
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
            'Index': { type: 'int', value: '0', options: ['0'] },
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
          'Natural Boundary Conditions': () => { return this.getViewData('Thermal Loads') },
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
          '(Natural Boundary Conditions)': 'Thermal Loads',
          '[Plato Problem]': 'Problem'
        }
      }
    }
  }
}

export default AnalyzeThermal
