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
      'Material Models': {
        'data': [],
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
            },
            'Thermal Mass': {
              'Temperature Dependent': { type: 'bool', value: 'false', options: [ 'false', 'true' ] },
              'Specific Heat Constant': {
                type: 'double',
                value: '900.0',
                conditionalView: ['Temperature Dependent', 'false'],
                alias: 'Specific Heat'
              },
              'Specific Heat': {
                'c0': { type: 'double', value: '900.0'},
                'c1': { type: 'double', value: '5.0e-4'},
                conditionalView: ['Temperature Dependent', 'true']
              },
              'Mass Density Constant': {
                type: 'double',
                value: '2700.0',
                conditionalView: ['Temperature Dependent', 'false'],
                alias: 'Mass Density'
              },
              'Mass Density': {
                'c0': { type: 'double', value: '2700.0'},
                'c1': { type: 'double', value: '0.0'},
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
            'Sides': { type: 'string', value: '', options: () => { return this.selectables['nodesets'].concat(this.selectables['sidesets']) } }
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

export default AnalyzeThermal
