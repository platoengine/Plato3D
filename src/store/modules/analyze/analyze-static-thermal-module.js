import AnalyzeScenarioBase from './analyze-scenario-base-module'

class AnalyzeStaticThermal extends AnalyzeScenarioBase {
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
            'Self-Adjoint': { type: 'bool', value: 'false', options: [ 'false', 'true' ] },
            'PDE Constraint': { type: 'string', value: 'Elliptic', fixed: true },
            'Elliptic': {
              'Plottable': { type: 'string', value: {'checkbox|Temperature Gradient': 'false|tgrad', 'checkbox|Thermal Flux': 'false|flux'} },
              'Penalty Function': {
                'Type': { type: 'string', value: 'SIMP', options: ['SIMP', 'RAMP', 'Heaviside'] },
                'Exponent': { type: 'double', value: '3.0' },
                'Minimum Value': { type: 'double', value: '1.0e-3' }
              }
            }
          }
        }
      },
      'Material Models': {
        'data': [],
        'required': true,
        'view': {
          'type': 'list-view',
          '<Template>': {
            'Thermal Conduction': {
              'Temperature Dependent': { type: 'bool', value: 'false', options: [ 'false', 'true' ] },
              'Thermal Conductivity Constant': {
                type: 'double',
                value: '210.0',
                conditionalView: ['Temperature Dependent', 'false'],
                alias: 'Thermal Conductivity'
              },
              'Thermal Conductivity': {
                'c011': { type: 'double', value: '205.0'},
                'c111': { type: 'double', value: '-0.02'},
                'c211': { type: 'double', value: '0.0008'},
                conditionalView: ['Temperature Dependent', 'true']
              }
            }
          }
        }
      },
      'Domains': {
        'data': [],
        'view': {
          'type': 'list-view',
          '<Template>': {
            'Element Block': { type: 'string', value: '', options: () => { return this.selectables['blocks'] } },
            'Material Model': { type: 'string', value: '', options: () => { return this.selectables['Material Models'] } }
          }
        }
      },
      'Criteria': {
        'data': [],
        'required': false,
        'view': {
          'type': 'list-view',
          '<Template>': {
            'Type': { type: 'string', value: 'Scalar Function', options: ['Scalar Function'] },
            'Linear': { type: 'bool', value: 'false', options: ['true', 'false'] },
            'Linear Scalar Function Type': {
              type: 'string',
              value: 'Volume',
              options: ['Volume'],
              conditionalView: ['Linear', 'true'],
              alias: 'Scalar Function Type'
            },
            'Scalar Function Type': {
              type: 'string',
              value: 'Internal Thermal Energy',
              options: ['Internal Thermal Energy', 'Flux P-Norm'],
              conditionalView: ['Linear', 'false']
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
        'Input Mesh': { type: 'string', value: () => this.geometry.body.fileName },
        'Plato Problem': {
          '(Problem)': () => { return this.getViewData('Problem') },
          'Material Models': () => { return this.getViewData('Material Models') },
          'Spatial Model': { 'Domains': () => { return this.getViewData('Domains') }},
          'Criteria': () => { return this.getViewData('Criteria') },
          'Natural Boundary Conditions': () => { return this.getViewData('Thermal Loads') },
          'Essential Boundary Conditions': () => { return this.getViewData('Constraints') }
        }
      }
    }
    this.inputData = {
      'Problem': {
        'Input Mesh': { type: 'string', value: (v) => {this.geometry.body.fileName = v} },
        'Plato Problem': {
          '(Criteria)': 'Criteria',
          '(Material Models)': 'Material Models',
          '(Essential Boundary Conditions)': 'Constraints',
          '(Natural Boundary Conditions)': 'Thermal Loads',
          '[Plato Problem]': 'Problem',
          'Spatial Model': {
             '(Domains)': 'Domains'
          }
        }
      }
    }
  }
}

export default AnalyzeStaticThermal
