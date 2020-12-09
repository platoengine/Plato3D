import AnalyzeScenarioBase from './analyze-scenario-base-module'

class AnalyzeMechanics extends AnalyzeScenarioBase {
  constructor () {
    super()
    this.hostPhysics = 'Mechanical'
    this.availableViewTypes = {
      'X Displacement': 'pvdToPLY_dispX.py',
      'Y Displacement': 'pvdToPLY_dispY.py',
      'Z Displacement': 'pvdToPLY_dispZ.py',
      'Displacement Mag': 'pvdToPLY_dispMag.py'
    }
    this.modelviews = {
      'Problem': {
        'data': null,
        'view': {
          'type': 'single-view',
          '<Template>': {
            'Physics': { type: 'string', value: 'Mechanical', fixed: true },
            'Self-Adjoint': { type: 'bool', value: 'false', options: [ 'false', 'true' ] },
            'PDE Constraint': { type: 'string', value: 'Elliptic', options: ['Elliptic', 'Hyperbolic'] },
            'Elliptic': {
              'Penalty Function': {
                'Type': { type: 'string', value: 'SIMP', options: ['SIMP', 'RAMP', 'Heaviside'] },
                'Exponent': { type: 'double', value: '3.0' },
                'Minimum Value': { type: 'double', value: '1.0e-3' }
              },
              conditionalView: ['PDE Constraint', 'Elliptic']
            },
            'Hyperbolic': {
              'Penalty Function': {
                'Type': { type: 'string', value: 'SIMP', options: ['SIMP', 'RAMP', 'Heaviside'] },
                'Exponent': { type: 'double', value: '3.0' },
                'Minimum Value': { type: 'double', value: '1.0e-3' }
              },
              conditionalView: ['PDE Constraint', 'Hyperbolic']
            },
            'Time Integration': {
              'Newmark Gamma': { type: 'double', value: '0.5'},
              'Newmark Beta': { type: 'double', value: '0.25' },
              'Number Time Steps': { type: 'int', value: '10' },
              'Time Step': { type: 'double', value: '1e-6' },
              conditionalView: ['PDE Constraint', 'Hyperbolic']
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
            'Model': { type: 'string', value: '', options: ['Isotropic Linear Elastic', 'Cubic Linear Elastic'], noWrite: true },
            'Isotropic Linear Elastic': {
              'Mass Density': { type: 'double', value: '2700.0' },
              'Poissons Ratio': { type: 'double', value: '0.33' },
              'Youngs Modulus': { type: 'double', value: '1e11' },
               conditionalView: ['Model', 'Isotropic Linear Elastic'],
               conditionalValue: ['Model', 'Isotropic Linear Elastic']
            },
            'Cubic Linear Elastic': {
              'Mass Density': { type: 'double', value: '2700.0' },
              'C11': { type: 'double', value: '1e11' },
              'C22': { type: 'double', value: '1e11' },
              'C33': { type: 'double', value: '1e11' },
               conditionalView: ['Model', 'Cubic Linear Elastic'],
               conditionalValue: ['Model', 'Cubic Linear Elastic']
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
        'isActive': (modelviews) => {
           try {return modelviews['Problem']['data']['PDE Constraint'].value === 'Hyperbolic'}
           catch (e) {return false}
        },
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
        'isActive': (modelviews) => {
           try {return modelviews['Problem']['data']['PDE Constraint'].value === 'Hyperbolic'}
           catch (e) {return false}
        },
        'view': {
          'type': 'list-view',
           'options': ['Displacement X', 'Displacement Y'],
          '<Template>': {
            'Computed Field': { type: 'string', value: '', options: () =>this.selectables['Computed Fields'] }
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
        'required': false,
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
        'required': false,
        'view': {
          'type': 'list-view',
          '<Template>': {
            'Type': { type: 'string', value: 'Zero Value', options: ['Zero Value', 'Fixed Value'] },
            'Index': { type: 'int', value: '0', options: ['0', '1', '2'] },
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
          'Computed Fields': () => { return this.getViewData('Computed Fields') },
          'Initial State': () => { return this.getViewData('Initial State') },
          'Criteria': () => { return this.getViewData('Criteria') },
          'Natural Boundary Conditions': () => { return this.getViewData('Mechanical Loads') },
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
          '(Natural Boundary Conditions)': 'Mechanical Loads',
          '[Plato Problem]': 'Problem',
          'Spatial Model': {
             '(Domains)': 'Domains'
          }
        }
      }
    }
  }
}

export default AnalyzeMechanics
