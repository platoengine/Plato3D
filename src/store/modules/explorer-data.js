import parseConsole from './parse-console'
import ErrorHandler from './error-handler-module'

const errorHandler = new ErrorHandler()

class ExplorerData {
  constructor () {

    this.changed = false

    this.axes = []

    this.data = []
  }

//    sessionData: {
//      changed: false,
//      axes: [
//        { active: true, min: 0.5,   max: 0.9,   name: 'Volume Fraction' },
//        { active: true, min: 1e6,   max: 1e7,   name: 'VM Stress (MPa), Scenario 0' },
//        { active: true, min: 100.0, max: 600.0, name: 'Compliance (m/N), Scenario 0' },
//        { active: true, min: 1e6,   max: 1e7,   name: 'VM Stress (MPa), Scenario 1' },
//        { active: true, min: 100.0, max: 600.0, name: 'Compliance (m/N), Scenario 1' }
//      ],
//      data: [
//        {
//          active: true,
//          value: [0.6, 2.5e6, 400.0, 4.0e6, 500.0],
//          name: 'Design 0'
//        },
//        {
//          active: true,
//          value: [0.8, 2.0e6, 300.0, 3.4e6, 400.0],
//          name: 'Design 1'
//        }
//      ]
//    },

  setChanged(state) {
    this.changed = state
  }

  setDataVisibility(index, newState) {
    this.data[index].active = newState
  }

  setAxisState(index, newState) {
    this.axes[index].active = newState
  }
  
  setAxisMin(index, newMin) {
    this.axes[index].min = newMin
  }
  
  setAxisMax(index, newMax) {
    this.axes[index].max = newMax
  }

  removeResultsData(optimization) {
    // remove data
    let dataIndex = this.data.findIndex( d => d.name === optimization.name )
    this.data.splice(dataIndex, 1)

    // see if there are any empty axes, if so remove them
    let index = this.axes.length
    while (index--) {
      let isUsed = false
      // any actual data in this column/axis?
      this.data.forEach( (datum) => { if (datum[index] !== 'n/a') { isUsed = true } })
      if (!isUsed) {
        // remove the axis
        this.axes.splice(index, 1)
        // remove the column associated with the axis
        this.data.forEach((datum) => { datum.splice(index, 1) })
      }
    }
    this.changed = true
  }
  addResultsData(optimization, resultsData) {
    let optimizationName = optimization.name
    let results = parseConsole(resultsData)
    let result = results.pop()
    
    // update axes
    //
    optimization.constraints.forEach( (value) => {
      // does the axis already exist?
      let axisName = `${value.scenario.name}:${value.criterionName}`
      let axisIndex = this.axes.findIndex( a => a.name === axisName )
      if (axisIndex === -1) {
        // nope.  add a new axis and initial values
        this.axes.push({ active: true, min: 0.0, max: 0.0, name: axisName })
        let newAxisIndex = this.axes.length - 1
        this.data.forEach( (d) => { d.value[newAxisIndex] = 'n/a' })
      }
    }, this)
    
    result.Name.forEach( (value) => {
      // does the axis already exist?
      let axisIndex = this.axes.findIndex( a => a.name === value )
      if (axisIndex === -1) {
        // nope.  add a new axis and initial values
        this.axes.push({ active: true, min: 0.0, max: 0.0, name: value })
        let newAxisIndex = this.axes.length - 1
        this.data.forEach( (d) => { d.value[newAxisIndex] = 'n/a' })
      }
    }, this)

    // if entry for this optimization doesn't exist, create it
    //
    let dataIndex = this.data.findIndex( d => d.name === optimizationName )
    if (dataIndex === -1) {
      this.data.push({ active: true, value: Array(this.axes.length).fill('n/a'), name: optimizationName })
    }

    // update data for this optimization
    // 
    optimization.constraints.forEach( (value) => {
      // does the axis already exist?
      let axisName = `${value.scenario.name}:${value.criterionName}`
      let axisIndex = this.axes.findIndex( a => a.name === axisName )
      if (axisIndex === -1) {
        errorHandler.report(`ERROR: found datum (${axisName}) with no axis!`)
      } else {
        let datumIndex = this.data.findIndex( a => a.name === optimizationName )
        if (datumIndex === -1) {
          errorHandler.report(`ERROR: No data entry found for this optimization (${optimizationName})`)
        } else {
          this.data[datumIndex].value[axisIndex] = value.target
        }
      }
    }, this)
    
    result.Name.forEach( (value, index) => {
      let axisIndex = this.axes.findIndex( a => a.name === value )
      if (axisIndex === -1) {
        errorHandler.report(`ERROR: found datum (${value}) with no axis!`)
      } else {
        let datumIndex = this.data.findIndex( a => a.name === optimizationName )
        if (datumIndex === -1) {
          errorHandler.report(`ERROR: No data entry found for this optimization (${optimizationName})`)
        } else {
          this.data[datumIndex].value[axisIndex] = result.Value[index]
        }
      }
    }, this)

    // update the axes min/max
    //
    this.axes.forEach( (axis, axisIndex) => {
      this.data.forEach( (datum) => {
        if (datum.value[axisIndex] > axis.max) axis.max = datum.value[axisIndex]
        if (datum.value[axisIndex] < axis.min) axis.min = datum.value[axisIndex]
      }, this)
      if (axis.max === axis.min) {
        axis.max *= 1.5
        axis.min *= 0.5
      }
    }, this)

    this.changed = true
  }
}

export default ExplorerData
