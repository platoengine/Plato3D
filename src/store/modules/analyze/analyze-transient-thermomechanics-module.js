import AnalyzeScenarioBase from './analyze-scenario-base-module'

class AnalyzeTransientThermomechanics extends AnalyzeScenarioBase {
  constructor () {
    super()
    this.hostPhysics = 'Thermomechanical'
    this.modelviews = {
      'Problem': {
        'data': null,
        'view': {
          'type': 'single-view',
          '<Template>': {
            'Physics': { type: 'string', value: 'Thermomechanical', fixed: true },
            'Self-Adjoint': { type: 'bool', value: 'false', options: [ 'false', 'true' ] },
            'PDE Constraint': { type: 'string', value: 'Elliptic', fixed: true },
            'Parabolic': {
              'Penalty Function': {
                'Type': { type: 'string', value: 'SIMP', options: ['SIMP', 'RAMP', 'Heaviside'], tooltip: 'Physics penalty method' },
                'Exponent': { type: 'double', value: '3.0', tooltip: 'Exponent must be positive' },
                'Minimum Value': { type: 'double', value: '1.0e-3', tooltip: 'Minimum value of the penalty function range.  Must be non-zero to guarantee stability.' }
              }
            },
            'Time Integration': {
              'Trapezoid Alpha': { type: 'double', value: '0.5'},
              'Number Time Steps': { type: 'int', value: '10' },
              'Time Step': { type: 'double', value: '1e-6' },
            },
            'Newton Iteration': {
              'Maximum Iterations': { type: 'int', value: '2'},
              'Increment tolerance': { type: 'double', value: '0.0' },
              'Residual tolerance': { type: 'double', value: '0.0' }
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
            'Thermal Mass': {
              'Temperature Dependent': { type: 'bool', value: 'false', options: [ 'false', 'true' ] },
              'Specific Heat|false': {
                type: 'double',
                value: '900.0',
                conditionalView: [['Temperature Dependent', 'false']],
                alias: 'Specific Heat'
              },
              'Specific Heat|true': {
                'c0': { type: 'double', value: '900.0'},
                'c1': { type: 'double', value: '5.0e-4'},
                conditionalView: [['Temperature Dependent', 'true']],
                alias: 'Specific Heat'
              },
              'Mass Density|false': {
                type: 'double',
                value: '2700.0',
                conditionalView: [['Temperature Dependent', 'false']],
                alias: 'Mass Density'
              },
              'Mass Density|true': {
                'c0': { type: 'double', value: '2700.0'},
                'c1': { type: 'double', value: '0.0'},
                conditionalView: [['Temperature Dependent', 'true']],
                alias: 'Mass Density'
              }
            },
            'Thermoelastic': {
              'Temperature Dependent': { type: 'bool', value: 'false', options: [ 'false', 'true' ] },
              'Reference Temperature': {
                type: 'double',
                value: '0.0'
              },
              'Thermal Conductivity|false': {
                type: 'double',
                value: '210.0',
                conditionalView: [['Temperature Dependent', 'false']],
                alias: 'Thermal Conductivity'
              },
              'Thermal Conductivity|true': {
                'c011': { type: 'double', value: '205.0'},
                'c111': { type: 'double', value: '0.0'},
                'c211': { type: 'double', value: '0.0'},
                conditionalView: [['Temperature Dependent', 'true']],
                alias: 'Thermal Conductivity'
              },
              'Thermal Expansivity|false': {
                type: 'double',
                value: '22.06e-6',
                conditionalView: [['Temperature Dependent', 'false']],
                alias: 'Thermal Expansivity'
              },
              'Thermal Expansivity|true': {
                'c011': { type: 'double', value: '22.06e-6'},
                'c111': { type: 'double', value: '0.0'},
                'c211': { type: 'double', value: '0.0'},
                conditionalView: [['Temperature Dependent', 'true']],
                alias: 'Thermal Expansivity'
              },
              'Elastic Stiffness|false': {
                'Youngs Modulus': {
                  type: 'double',
                  value: '6.90342e10',
                },
                'Poissons Ratio': { type: 'double', value: '0.35' },
                conditionalView: [['Temperature Dependent', 'false']],
                alias: 'Elastic Stiffness'
              },
              'Elastic Stiffness|true': {
                'Youngs Modulus': {
                  'c0': { type: 'double', value: '6.90342e10'},
                  'c1': { type: 'double', value: '0.0'},
                  'c2': { type: 'double', value: '0.0'}
                },
                'Poissons Ratio': { type: 'double', value: '0.35' },
                conditionalView: [['Temperature Dependent', 'true']],
                alias: 'Elastic Stiffness'
              }
            }
          }
        }
      },
      'Domains': {
        'data': [],
        'required': true,
        'view': {
          'type': 'list-view',
          '<Template>': {
            'Element Block': { type: 'string', value: '', options: () => { return this.selectables['blocks'] } },
            'Material Model': { type: 'string', value: '', options: () => { return this.selectables['Material Models'] } }
          }
        }
      },
      'Computed Fields': {
        'data': [],
        'required': false,
        'view': {
          'type': 'list-view',
          '<Template>': {
            'Function': { type: 'string', value: '' }
          }
        }
      },
      'Initial State': {
        'data': [],
        'required': false,
        'view': {
          'type': 'list-view',
           'options': ['Displacement X', 'Displacement Y', 'Displacement Z', 'Temperature'],
          '<Template>': {
            'Computed Field': { type: 'string', value: '', options: () =>this.selectables['Computed Fields'] }
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
            'Exponent': { type: 'double', value: '6.0', conditionalView: [['Scalar Function Type', 'Flux P-Norm']] },
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
            'Values': { type: 'double', value: {'X': '0.0', 'Y': '0.0', 'Z': '0.0'}, conditionalView: [['Type', 'Uniform']] },
            'Value': { type: 'double', value: '0.0', conditionalView: [['Type', 'Uniform Component']] },
            'Component': { type: 'string', value: 'X', options: ['X', 'Y', 'Z'], conditionalView: [['Type', 'Uniform Component']] },
            'Sides': { type: 'string', value: '', options: () => { return this.selectables['sidesets'] } }
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
            'Index': { type: 'int', value: '0', options: ['0', '1', '2', '3'] },
            'Value': { type: 'double', value: '0.0', conditionalView: [['Type', 'Fixed Value']] },
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
          'Computed Fields': () => { return this.getViewData('Computed Fields') },
          'Initial State': () => { return this.getViewData('Initial State') },
          'Criteria': () => { return this.getViewData('Criteria') },
          'Mechanical Natural Boundary Conditions': () => { return this.getViewData('Mechanical Loads') },
          'Thermal Natural Boundary Conditions': () => { return this.getViewData('Thermal Loads') },
          'Essential Boundary Conditions': () => { return this.getViewData('Constraints') }
        }
      }
    }
    this.inputData = {
      'Problem': {
        'Input Mesh': { type: 'string', value: (v) => {this.geometry.body.fileName = v} },
        'Plato Problem': {
          '(Criteria)': 'Criteria',
          '(Computed Fields)': 'Computed Fields',
          '(Initial State)': 'Initial State',
          '(Material Models)': 'Material Models',
          '(Essential Boundary Conditions)': 'Constraints',
          '(Mechanical Natural Boundary Conditions)': 'Mechanical Loads',
          '(Thermal Natural Boundary Conditions)': 'Thermal Loads',
          '[Plato Problem]': 'Problem',
          'Spatial Model': {
             '(Domains)': 'Domains'
          }
        }
      }
    }
  }
}

export default AnalyzeTransientThermomechanics
