import AnalyzeScenarioBase from './analyze-scenario-base-module'

class AnalyzeThermomechanics extends AnalyzeScenarioBase {
  constructor () {
    super()
    this.hostPhysics = 'Thermomechanics'
    this.modelviews = {
      'Problem': {
        'data': {},
        'view': {
          'type': 'single-view',
          '<Template>': {
            'Physics': { type: 'string', value: 'Thermomechanical', fixed: true },
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
            }
          }
        }
      },
      'Material Model': {
        'data': {},
        'view': {
          'type': 'option-view',
          '<Options>': {
            'Isotropic Linear Thermoelastic': {
              'Poissons Ratio': { type: 'double', value: '0.33' },
              'Youngs Modulus': { type: 'double', value: '1e11' },
              'Thermal Expansion Coefficient': { type: 'double', value: '2.4e-5' },
              'Thermal Conductivity Coefficient': { type: 'double', value: '210.0' }
            },
            'Cubic Linear Thermoelastic': {
              'Poissons Ratio': { type: 'double', value: '0.33' },
              'Youngs Modulus': { type: 'double', value: '1e11' },
              'a11': { type: 'double', value: '2.4e-5' },
              'a22': { type: 'double', value: '1.4e-5' },
              'a33': { type: 'double', value: '1.4e-5' },
              'k11': { type: 'double', value: '210.0' },
              'k22': { type: 'double', value: '210.0' },
              'k33': { type: 'double', value: '210.0' }
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
              options: ['Volume', 'Internal Thermoelastic Energy']
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

export default AnalyzeThermomechanics
