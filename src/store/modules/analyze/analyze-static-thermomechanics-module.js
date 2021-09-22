import AnalyzeScenarioBase from './analyze-scenario-base-module'

class AnalyzeStaticThermomechanics extends AnalyzeScenarioBase {
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
            'Elliptic': {
              'Penalty Function': {
                'Type': { type: 'string', value: 'SIMP', options: ['SIMP', 'RAMP', 'Heaviside'] },
                'Exponent': { type: 'double', value: '3.0' },
                'Minimum Value': { type: 'double', value: '1.0e-3' }
              }
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
            'Thermoelastic': {
              'Temperature Dependent': { type: 'bool', value: 'false', options: [ 'false', 'true' ] },
              'Reference Temperature': {
                type: 'double',
                value: '0.0'
              },
              'Thermal Conductivity Constant': {
                type: 'double',
                value: '210.0',
                conditionalView: ['Temperature Dependent', 'false'],
                alias: 'Thermal Conductivity'
              },
              'Thermal Conductivity': {
                'c011': { type: 'double', value: '205.0'},
                'c111': { type: 'double', value: '0.0'},
                'c211': { type: 'double', value: '0.0'},
                conditionalView: ['Temperature Dependent', 'true']
              },
              'Thermal Expansivity Constant': {
                type: 'double',
                value: '22.06e-6',
                conditionalView: ['Temperature Dependent', 'false'],
                alias: 'Thermal Expansivity'
              },
              'Thermal Expansivity': {
                'c011': { type: 'double', value: '22.06e-6'},
                'c111': { type: 'double', value: '0.0'},
                'c211': { type: 'double', value: '0.0'},
                conditionalView: ['Temperature Dependent', 'true']
              },
              'Elastic Stiffness Constant': {
                'Youngs Modulus': {
                  type: 'double',
                  value: '6.90342e10',
                },
                'Poissons Ratio': { type: 'double', value: '0.35' },
                conditionalView: ['Temperature Dependent', 'false'],
                alias: 'Elastic Stiffness'
              },
              'Elastic Stiffness': {
                'Youngs Modulus': {
                  'c0': { type: 'double', value: '6.90342e10'},
                  'c1': { type: 'double', value: '0.0'},
                  'c2': { type: 'double', value: '0.0'},
                },
                'Poissons Ratio': { type: 'double', value: '0.35' },
                conditionalView: ['Temperature Dependent', 'true']
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
              value: 'Internal Thermoelastic Energy',
              options: ['Internal Thermoelastic Energy'],
              conditionalView: ['Linear', 'false']
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

export default AnalyzeStaticThermomechanics
