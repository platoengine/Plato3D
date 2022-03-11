import ParBase from './par-base'
import XMLWriter from 'xml-writer'
import {dynamicCopy, staticCopy} from '../../components/ui/ByValue'

// TODO: create a geometry object that hold all geometry related settings such as
// filter, initial topology value, symmetry, fixed blocks, overhang constraints, etc.  

class Optimization extends ParBase {
  constructor () {
    super()
    this.resources = {numProcs: 1}
    this.optimizer = {
      selected: "MMA",
      packages: {
        KSAL: {
          'KSTrustRegionExpansionFactor': { type: 'double', value: '2.0', alias: 'Trust Region Expansion Factor' },
          'KSTrustRegionContractionFactor': { type: 'double', value: '0.75', alias: 'Trust Region Contraction Factor' },
          'KSMaxTrustRegionIterations': { type: 'int', value: '5', alias: 'Trust Region Iterations' },
          'KSInitialRadiusScale': { type: 'double', value: '0.1', alias: 'Initial Radius Scale' },
          'KSMaxRadiusScale': { type: 'double', value: '0.5', alias: 'Max Radius Scale' },
          'MinTrustRegionRadius': { type: 'double', value: '1e-6', alias: 'Min Trust Region Radius' },
          'LimitedMemoryStorage': { type: 'int', value: '8', alias: 'Limited Memory Storage' },
          'HessianType': { type: 'string', value: 'disabled', alias: 'Hessian Type' },
          'KSOuterGradientTolerance': { type: 'double', value: '0.5', alias: 'Outer Gradient Tolerance' },
          'AugLagPenaltyParam': { type: 'double', value: '1.0', alias: 'Augmented Lagrangian Penalty' },
          'MaxIterations': { type: 'int', value: '10', alias: 'Maximum Iterations' }
        },
        MMA: {
          'MaxNumOuterIterations': { type: 'int', value: '25', alias: 'Maximum Outer Iterations' },
          'MoveLimit': { type: 'double', value: '0.5', alias: 'Move Limit' },
          'AsymptoteExpansion': { type: 'double', value: '1.2', alias: 'Asymptote Expansion' },
          'AsymptoteContraction': { type: 'double', value: '0.7', alias: 'Asymptote Contraction' },
          'MaxNumSubProblemIter': { type: 'int', value: '100', alias: 'Max Sub-problem Iterations' },
          'ControlStagnationTolerance': { type: 'double', value: '1e-6', alias: 'Control Stagnation Tolerance' },
          'ObjectiveStagnationTolerance': { type: 'double', value: '1e-8', alias: 'Objective Stagnation Tolerance' },
          'SubProblemInitialPenalty': { type: 'double', value: '0.0015', alias: 'Sub-problem Initial Penalty' },
          'SubProblemPenaltyMultiplier': { type: 'double', value: '1.025', alias: 'Sub-problem Penalty Multiplier' },
          'SubProblemFeasibilityTolerance': { type: 'double', value: '1.0e-8', alias: 'Sub-problem Feasibility Tolerance' },
          'UseIpoptForMMASubproblem': { type: 'bool', value: 'true', options: ['false', 'true' ], alias: 'Use Ipopt For MMA Sub-problem' }
        },
        OC: {
          'MaxIterations': { type: 'int', value: '25', alias: 'Maximum Iterations' }
        }
      }
    }
    this.solver = {
      'solver': { type: 'string', value: 'PCG', alias: 'Solver Type', options: ["PCG", "PBICGSTAB"] },
      'max_iters': { type: 'int', value: '500', alias: 'Max Linear Solver Iterations' },
      'tolerance': { type: 'double', value: '1e-7', alias: 'Absolute Solver Tolerance' }
    }
    this.objectives = []
    this.normalizeObjectives = true
    this.constraints = []
    this.simulation = {inputFile: '', computeStatus: '', availableViewTypes: {}, views: []}
    this.filterRadius = 2.48 // default value 
    this.initialValue = 0.25 // default value
    this.applyFilter = true // default value 
    this.fixedBlocks = []
    this.symmetry = []
    this.useEngineFilter = false // hardwired (false) to use the filter in PlatoAnalyze (not PlatoEngine)
    this.run = {computeStatus: 'idle', runDir: 'not set', iterations: [], activeIteration: 0}
    this.display = {opacity: 1.0, wireframe: false, visible: true}
    this.convergenceData = {x: [], y: [], type: 'scatter'}
  }
  destructor (graphics) {
    this.run.iterations.forEach(iteration => {
      graphics.scene.remove(graphics.scene.getObjectById(iteration.geometryID))
    })
  }
  //**************************************************************************//
  //  Tested: false
  //
  //  Description: Reinitializes this instance with the given data and points
  //  the objectives and constraints members to the given scenarios.
  // 
  //  Usage: MongoDB doesn't store member functions.  Use this function to
  //  initialize a new Optimization instance from data recalled from the
  //  database.  Further, the objectives and constraints data members will
  //  contain copies of scenarios that no longer exist.  This function
  //  connects the objectives and constraints to the recalled scenarios.
  //
  //**************************************************************************//
  fromData(data, scenarios) {
    dynamicCopy(data, this)
    this.run.activeIteration = this.run.iterations.length-1
    this.objectives.forEach( obj => {
      let scenarioIndex = scenarios.findIndex( scenario => scenario.name === obj.scenario.name )
      if (scenarioIndex === -1) {
        obj.scenario = {}
      } else {
        obj.scenario = scenarios[scenarioIndex]
      }
    })
    this.constraints.forEach( con => {
      let scenarioIndex = scenarios.findIndex( scenario => scenario.name === con.scenario.name )
      if (scenarioIndex === -1) {
        con.scenario = {}
      } else {
        con.scenario = scenarios[scenarioIndex]
      }
    })
  }
  copy () {
    let myCopy = new Optimization()
    staticCopy(this, myCopy)
    myCopy.run.iterations.length=0
    myCopy.run.activeIteration = 0
    myCopy.run.computeStatus = 'idle'
    myCopy.display.visible = true
    return myCopy
  }
  setOptimizationVisibility(graphics, visibility) {
    this.display.visible = visibility
    let iteration = this.run.iterations[this.run.activeIteration]
    let lastGeom = graphics.scene.getObjectById(iteration.geometryID)
    lastGeom.visible = this.display.visible
  }
  setDisplayAttributes(graphics, attribute, value) {
    this.display[attribute] = value
    if (this.run.iterations.length > 0) {
      let geomID = this.run.iterations[this.run.activeIteration].geometryID
      let geom = graphics.scene.getObjectById(geomID)
      geom.visible = this.display.visible
      geom.material.opacity = this.display.opacity
      geom.material.wireframe = this.display.wireframe
    }
  }
  clear(graphics) {
    this.run.iterations.forEach( (it) => {
      let geom = graphics.scene.getObjectById(it.geometryID)
      graphics.scene.remove(geom)
    })
  }
  newIterationAtEnd (payload) {
    let iterations = this.run.iterations

    // if the last iteration is the active iteration then add the new iteration
    // visible and increment the active iteration
    let addVisible = this.display.visible
    let lastIndex = iterations.length - 1
    if (this.run.activeIteration === lastIndex) {
      this.setVisibility(payload.graphics, lastIndex, false)
      this.run.activeIteration++
    } else {
      addVisible = false
    }
    payload.geometry.visible = addVisible
    payload.geometry.material.transparent = true
    payload.geometry.material.wireframe = this.display.wireframe
    payload.geometry.material.opacity = this.display.opacity
    let newIteration = {
      geometryID: payload.geometry.id,
      iteration: payload.iteration,
      isVisible: this.display.visible,
      isWireframe: this.display.wireframe
    }
    return newIteration
  }
  newIteration (payload) {
    let addVisible = this.display.visible
    if (this.run.activeIteration === payload.index) {
      addVisible = addVisible && true
    } else {
      addVisible = false
    }
    payload.geometry.visible = addVisible
    payload.geometry.material.transparent = true
    payload.geometry.material.wireframe = this.display.wireframe
    payload.geometry.material.opacity = this.display.opacity
    let newIteration = {
      geometryID: payload.geometry.id,
      iteration: payload.iteration,
      isVisible: this.display.visible,
      isWireframe: this.display.wireframe
    }
    return newIteration
  }
  addIteration (payload) {
    let newIteration = this.newIterationAtEnd(payload)
    this.run.iterations.push(newIteration)
    payload.graphics.scene.add(payload.geometry)
  }
  setIteration (payload) {
    let newIteration = this.newIteration(payload)
    this.run.iterations[payload.index] = newIteration
    payload.graphics.scene.add(payload.geometry)
  }
  toFirstIteration(graphics) {
    this.setVisibility(graphics, this.run.activeIteration, false)
    this.run.activeIteration = 0
    this.setVisibility(graphics, this.run.activeIteration, true)
  }
  toLastIteration(graphics) {
    this.setVisibility(graphics, this.run.activeIteration, false)
    this.run.activeIteration = this.run.iterations.length - 1
    this.setVisibility(graphics, this.run.activeIteration, true)
  }
  incrementActiveIteration(graphics) {
    let lastIndex = this.run.iterations.length - 1
    if (this.run.activeIteration < lastIndex) {
      this.setVisibility(graphics, this.run.activeIteration, false)
      this.run.activeIteration++
      this.setVisibility(graphics, this.run.activeIteration, true)
    }
  }
  decrementActiveIteration(graphics) {
    if (this.run.activeIteration > 0) {
      this.setVisibility(graphics, this.run.activeIteration, false)
      this.run.activeIteration--
      this.setVisibility(graphics, this.run.activeIteration, true)
    }
  }
  setVisibility (graphics, index, visibility) {
    let iteration = this.run.iterations[index]
    let lastGeom = graphics.scene.getObjectById(iteration.geometryID)
    if (lastGeom) {
      lastGeom.visible = this.display.visible && visibility
      lastGeom.material.wireframe = this.display.wireframe
      lastGeom.material.opacity = this.display.opacity
    }
  }
  resetRun (graphics) {
    this.run.iterations.forEach((iteration) => {
      let geom = graphics.scene.getObjectById(iteration.geometryID)
      graphics.scene.remove(geom)
    })
    this.run.iterations = []
    this.run.activeIteration = 0
  }
  writeMpirunSourceFile(uniqueScenarios) {
    let mpirun_source = "mpirun -np 1 --oversubscribe --allow-run-as-root "
    mpirun_source += "-x PLATO_PERFORMER_ID=0 "
    mpirun_source += "-x PLATO_INTERFACE_FILE=interface.xml "
    mpirun_source += "-x PLATO_APP_FILE=platoApp.xml "
    mpirun_source += "PlatoMain platoInput.xml : "
    mpirun_source += "-np 1 --oversubscribe "
    mpirun_source += "-x PLATO_PERFORMER_ID=1 "
    mpirun_source += "-x PLATO_INTERFACE_FILE=interface.xml "
    mpirun_source += "-x PLATO_APP_FILE=analyzeApp.xml "
    mpirun_source += `analyze_MPMD --input-config=${this.inputFileName(uniqueScenarios[0].name)}`
    return mpirun_source
  }
  setupFilter({platoApp, analyzeApp}) {
    if (this.useEngineFilter) {
      this.addBranch({
        Filter: {
          Name: "Kernel",
          Scale: this.filterRadius,
          Absolute: -1
        }
      }, platoApp)

      this.addBranch({
        Operation: {
          Function: "Filter",
          Name: "FilterControl",
          Input: { ArgumentName: "Field"},
          Output: { ArgumentName: "Filtered Field"},
          Gradient: "False"
        }
      }, platoApp)

      this.addBranch({
        Operation: {
          Function: "Filter",
          Name: "FilterGradient",
          Input: { ArgumentName: "Gradient"},
          Output: { ArgumentName: "Filtered Gradient"},
          Gradient: "True"
        }
      }, platoApp)
    } else {
      let tMeshMap = {
        MeshMap: {
          FilterFirst: "false",
          Filter: { Type: "Linear", Radius: this.filterRadius }
        }
      }
      const tSym = this.getSymmetry()
      if (tSym.X || tSym.Y || tSym.Z) {
        let tSearchTolerance = this.filterRadius/2.0 // TODO: add input for this?  use default based on average element size?
        let tOriginX = 0.0 // TODO: add input for this? 
        let tOriginY = 0.0 // TODO: add input for this? 
        let tOriginZ = 0.0 // TODO: add input for this? 
        // TODO: below assumes symmetry on coordinate planes only, the actual implementation in PA is more general.
        tMeshMap['MeshMap']['LinearMap'] = {
          Type: 'SymmetryPlane',
          SearchTolerance: tSearchTolerance,
          Origin: { X: tOriginX, Y: tOriginY, Z: tOriginZ },
        }
        if (tSym.X) {
          tMeshMap['MeshMap']['LinearMap']['Normal'] = {X: 1.0, Y: 0.0, Z: 0.0}
        } else
        if (tSym.Y) {
          tMeshMap['MeshMap']['LinearMap']['Normal'] = {X: 0.0, Y: 1.0, Z: 0.0}
        } else
        if (tSym.Z) {
          tMeshMap['MeshMap']['LinearMap']['Normal'] = {X: 0.0, Y: 0.0, Z: 1.0}
        }
      } else {
        tMeshMap['MeshMap']['LinearMap'] = ""
      }
      this.addBranch(tMeshMap, analyzeApp)
    }
  }
  // currently, optimizations only support one model.  return the symmetry object
  // associated with that one model.  Generalize this when multiple models are supported
  getSymmetry() {
    if (this.symmetry.length > 1) {
      throw "Optimization: More that one model entry found in the symmetry object"
    } else 
    if (this.symmetry.length === 0) {
      throw "Optimization: No model entry found in the symmetry object"
    }
    return this.symmetry[0]
  }
  isObject (aVar) {
    return typeof aVar === 'object' && !Array.isArray(aVar)
  }
  addBranch(tBranch, xw) {
    Object.keys(tBranch).forEach((key) => {
      let tSub = tBranch[key]
      if (this.isObject(tSub)) {
        let tSubKey = key.split("__")[0]
        xw.startElement(tSubKey)
        this.addBranch(tSub, xw)
        xw.endElement()
      } else {
        let tSubKey = key.split("__")[0]
        xw.startElement(tSubKey)
        xw.text(tSub)
        xw.endElement()
      }
    }, this)
  }
  addBoundsOperations(xw, fixedIndices) {
    let lowerOp = {
      Operation: {
        Function: "SetLowerBounds",
        Name: "Calculate Lower Bounds",
        Input: { ArgumentName: "Lower Bound Value"},
        Output: { ArgumentName: "Lower Bound Vector"},
        Discretization: "density"
      }
    }
    lowerOp["Operation"]["FixedBlocks"] = {}
    fixedIndices.forEach((fb, i) => {
      lowerOp["Operation"]["FixedBlocks"][`Index__${i}`] = fb.toString()
    })
    this.addBranch(lowerOp, xw)
    let upperOp = {
      Operation: {
        Function: "SetUpperBounds",
        Name: "Calculate Upper Bounds",
        Input: { ArgumentName: "Upper Bound Value"},
        Output: { ArgumentName: "Upper Bound Vector"},
        Discretization: "density"
      }
    }
    upperOp["Operation"]["FixedBlocks"] = {}
    fixedIndices.forEach((fb, i) => {
      upperOp["Operation"]["FixedBlocks"][`Index__${i}`] = fb.toString()
    })
    this.addBranch(upperOp, xw)
  }
  setupInitialization({platoApp, interfaceFile}) {
    // add operation declarations to platoApp file
    this.addBranch({
      Operation: {
        Function: "InitializeField",
        Name: "Initialize Field",
        Method: "Uniform",
        Output: {
          ArgumentName: "Initialized Field"
        },
        Uniform: {
          Value: this.initialValue
        }
      }
    }, platoApp)

    // add stage to interface file
    let newStage = {
      Stage: {
        Name: "Initialize Optimization",
        Output: {
          SharedDataName: "Optimization DOFs"
        },
        Operation: {
          Name: "Initialize Field",
          PerformerName: "PlatoMain",
          Output: {
            ArgumentName: "Initialized Field",
            SharedDataName: "Optimization DOFs"
          }
        }
      }
    }
    if (this.normalizeObjectives) {
      if (this.useEngineFilter) {
        newStage["Stage"]["Operation__Normalize"] = {
          Name: "FilterControl",
          PerformerName: "PlatoMain",
          Input: {
            ArgumentName: "Field",
            SharedDataName: "Optimization DOFs"
          },
          Output: {
            ArgumentName: "Filtered Field",
            SharedDataName: "Topology"
          }
        }
      }
      
      let tTopologyName = (this.useEngineFilter) ? 'Topology' : 'Optimization DOFs'
      this.objectives.forEach((obj) => {
        let tObjName = `${obj.scenario.name}:${obj.criterionName}`
        let tSharedDataName = `Initial ${tObjName} Value`
        // add Initial Value operation to stage
        newStage["Stage"][`Operation__${tObjName}`] = {
          Name: `Compute ${tObjName} Value`,
          PerformerName: "Analyze",
          Input: {
            ArgumentName: "Topology",
            SharedDataName: tTopologyName
          },
          Output: {
            ArgumentName: `${tObjName} Value`,
            SharedDataName: tSharedDataName
          }
        }
        this.addSharedData({Name: tSharedDataName, Type: "Scalar", Layout: "Global", OwnerName: "Analyze", UserName: "PlatoMain"}, interfaceFile)
      }, this)
    }
    this.addBranch(newStage, interfaceFile)
  }
  setupDesignVolumeStage({platoApp, interfaceFile}) {
    let needed = this.constraints.map((c) => c.perVolume).reduce( (a, c) => {return a || c}, false)

    if (needed) {
      // add operation to platoApp
      this.addBranch({
        Operation: {
          Function: "DesignVolume",
          Name: "Design Volume",
          Output: {
            ArgumentName: "Design Volume"
          },
          Blocks: 1
        }
      }, platoApp)

      // add shared data
      this.addSharedData({Name: "Design Volume", Type: "Scalar", Layout: "Global", OwnerName: "PlatoMain", UserName: "PlatoMain"}, interfaceFile)

      // add stage to interface file
      this.addBranch({
        Stage: {
          Name: "Design Volume",
          Operation: {
            Name: "Design Volume",
            PerformerName: "PlatoMain",
            Output: {
              ArgumentName: "Design Volume",
              SharedDataName: "Design Volume"
            }
          },
          Output: {
            SharedDataName: "Design Volume"
          }
        }
      }, interfaceFile)
    }
  }
  addComputeVolume(xw) {
    this.addBranch({
      Operation: {
        Function: "ComputeVolume",
        Name: "Compute Current Volume",
        Input: {
          ArgumentName: "Topology"
        },
        Output__1: {
          ArgumentName: "Volume"
        },
        Output__2: {
          ArgumentName: "Volume Gradient"
        },
        PenaltyModel: "SIMP",
        SIMP: {
          PenaltyExponent: 1.0,
          MinimumValue: 0.0
        }
      }
    }, xw)
  }
  writePlatoInputFile(xw) {

    if (this.objectives.length === 0) {
      throw "Attempted optimization with no objectives defined."
    }

    let meshFileName = ""
    this.objectives.forEach((obj) => {
      if (meshFileName !== "") {
        if (obj.scenario.geometry.body.fileName !== meshFileName) {
          throw "Objectives must be based on the same model"
        }
      } else {
        meshFileName = obj.scenario.geometry.body.fileName
      }
    })

    let outputFileName = "platomain"

    xw.startDocument()

    this.addBranch({
      mesh: {
        type: "unstructured",
        format: "exodus",
        mesh: meshFileName,
        ignore_node_map: "true",
        ignore_element_map: "true",
        block: {
          index: 1,
          integration: {
            type: "gauss",
            order: 2
          }
        }
      },
      output: {
        file: outputFileName,
        format: "exodus"
      }
    }, xw)

    xw.endDocument()

    return xw.toString()
  }
  addPerformer(tArg, xw) {
    this.addBranch({Performer: tArg}, xw)
  }
  setupConsole({interfaceFile}) {
    this.addBranch({Console: { Enabled: 'true'}}, interfaceFile)
  }
  setupPerformers({interfaceFile}) {
    this.addPerformer({Name: "PlatoMain", Code: "Plato_Main", PerformerID: 0}, interfaceFile)
    this.addPerformer({Name: "Analyze", Code: "Analyze", PerformerID: 1}, interfaceFile)
  }
  addSharedData(tArg, xw) {
    this.addBranch({SharedData: tArg}, xw)
  }
  setupSharedData({interfaceFile}) {
    if (this.useEngineFilter) {
      this.addSharedData({Name: "Topology", Type: "Scalar", Layout: "Nodal Field", OwnerName: "PlatoMain", UserName__1: "PlatoMain", UserName__2: "Analyze"}, interfaceFile)
    } else {
      this.addSharedData({Name: "Mapped Topology", Type: "Scalar", Layout: "Nodal Field", OwnerName: "Analyze", UserName: "PlatoMain"}, interfaceFile)
    }
    this.addSharedData({Name: "Optimization DOFs", Type: "Scalar", Layout: "Nodal Field", OwnerName: "PlatoMain", UserName__1: "PlatoMain", UserName__2: "Analyze"}, interfaceFile)
  }
  writeInterfaceFile() {
    let xw = new XMLWriter(true)
    xw.startDocument()

    this.addSharedData({Name: "Volume Gradient", Type: "Scalar", Layout: "Nodal Field", OwnerName: "PlatoMain", UserName: "PlatoMain"})
    this.addSharedData({Name: "Volume", Type: "Scalar", Layout: "Global", OwnerName: "PlatoMain", UserName: "PlatoMain"})

    this.addSetBounds(xw)

    xw.endDocument()
    return xw.toString()
  }
  addBoundsStages(interfaceFile) {
    this.addBranch({
      Stage: {
        Name: "Set Lower Bounds",
        Input: {
          SharedDataName: "Lower Bound Value"
        },
        Operation: {
          Name: "Calculate Lower Bounds",
          PerformerName: "PlatoMain",
          Input: {
            ArgumentName: "Lower Bound Value",
            SharedDataName: "Lower Bound Value"
          },
          Output: {
            ArgumentName: "Lower Bound Vector",
            SharedDataName: "Lower Bound Vector"
          }
        },
        Output: {
          SharedDataName: "Lower Bound Vector"
        }
      }
    }, interfaceFile)

    this.addBranch({
      Stage: {
        Name: "Set Upper Bounds",
        Input: {
          SharedDataName: "Upper Bound Value"
        },
        Operation: {
          Name: "Calculate Upper Bounds",
          PerformerName: "PlatoMain",
          Input: {
            ArgumentName: "Upper Bound Value",
            SharedDataName: "Upper Bound Value"
          },
          Output: {
            ArgumentName: "Upper Bound Vector",
            SharedDataName: "Upper Bound Vector"
          }
        },
        Output: {
          SharedDataName: "Upper Bound Vector"
        }
      }
    }, interfaceFile)
  }
  setupBounds({platoApp, interfaceFile}, fixedIndices) {
    this.addSharedData({Name: "Lower Bound Value", Type: "Scalar", Layout: "Global", OwnerName: "PlatoMain", UserName: "PlatoMain"}, interfaceFile)
    this.addSharedData({Name: "Upper Bound Value", Type: "Scalar", Layout: "Global", OwnerName: "PlatoMain", UserName: "PlatoMain"}, interfaceFile)
    this.addSharedData({Name: "Lower Bound Vector", Type: "Scalar", Layout: "Nodal Field", OwnerName: "PlatoMain", UserName: "PlatoMain"}, interfaceFile)
    this.addSharedData({Name: "Upper Bound Vector", Type: "Scalar", Layout: "Nodal Field", OwnerName: "PlatoMain", UserName: "PlatoMain"}, interfaceFile)

    this.addBoundsOperations(platoApp, fixedIndices)
    this.addBoundsStages(interfaceFile)
  }
  addCriterionOperation(aObj, analyzeApp) {
    // add Value Operation
    let objName = `${aObj.scenario.name}:${aObj.criterionName}`
    this.addBranch({
      Operation: {
        Function: "ComputeCriterionValue",
        Criterion: aObj.criterionName,
        ProblemDefinition: this.inputFileName(aObj.scenario.name),
        Name: `Compute ${objName} Value`,
        Input: {
          ArgumentName: "Topology"
        },
        Output: {
          Argument: "Value",
          ArgumentName: `${objName} Value`
        }
      }
    }, analyzeApp)

    // add Gradient Operation
    this.addBranch({
      Operation: {
        Function: "ComputeCriterionGradient",
        Criterion: aObj.criterionName,
        ProblemDefinition: this.inputFileName(aObj.scenario.name),
        Name: `Compute ${objName} Gradient`,
        Input: {
          ArgumentName: "Topology"
        },
        Output: {
          Argument: "Gradient",
          ArgumentName: `${objName} Gradient`
        }
      }
    }, analyzeApp)

    // add Value and Gradient Operation
    this.addBranch({
      Operation: {
        Function: "ComputeCriterion",
        Criterion: aObj.criterionName,
        ProblemDefinition: this.inputFileName(aObj.scenario.name),
        Name: `Compute ${objName}`,
        Input: {
          ArgumentName: "Topology"
        },
        Output__1: {
          Argument: "Gradient",
          ArgumentName: `${objName} Gradient`
        },
        Output__2: {
          Argument: "Value",
          ArgumentName: `${objName} Value`
        }
      }
    }, analyzeApp)
  }
  setupConstraintCriteria({analyzeApp}){
    // add the operation to the analyze app file
    this.constraints.forEach((constraint) => {
      this.addCriterionOperation(constraint, analyzeApp)
    })
  }
  setupConstraint({interfaceFile}){
    this.constraints.forEach((con) => {
      let conName = `${con.scenario.name}:${con.criterionName}`
      let newStage = {
        Stage: {
          Name: conName,
          Input: {
            SharedDataName: "Optimization DOFs"
          }
        }
      }
      if (this.useEngineFilter) {
        newStage['Stage']['Operation'] = {
          Name: "FilterControl",
          PerformerName: "PlatoMain",
          Input: {
            ArgumentName: "Field",
            SharedDataName: "Optimization DOFs"
          },
          Output: {
            ArgumentName: "Filtered Field",
            SharedDataName: "Topology"
          }
        }
      }
      let tTopologyName = (this.useEngineFilter) ? 'Topology' : 'Optimization DOFs'
      newStage["Stage"][`Operation__${conName}`] = {
        Name: `Compute ${conName} Value`,
        PerformerName: "Analyze",
        Input: {
          ArgumentName: "Topology",
          SharedDataName: tTopologyName
        },
        Output: {
          ArgumentName: `${conName} Value`,
          SharedDataName: conName
        }
      }
      newStage["Stage"]["Output"] = {
        SharedDataName: `${conName}`
      }
      this.addBranch(newStage, interfaceFile)
      this.addSharedData({Name: conName, Type: "Scalar", Layout: "Global", OwnerName: "Analyze", UserName: "PlatoMain"}, interfaceFile)
    }, this)
  }
  setupConstraintGradient({interfaceFile}){
    // add stage to interface file
    this.constraints.forEach((con) => {
      let conName = `${con.scenario.name}:${con.criterionName}`
      let newStage = {
        Stage: {
          Name: `${conName} Gradient`,
          Input: {
            SharedDataName: "Optimization DOFs"
          }
        }
      }
      if (this.useEngineFilter) {
        newStage['Stage']['Operation'] = {
          Name: "FilterControl",
          PerformerName: "PlatoMain",
          Input: {
            ArgumentName: "Field",
            SharedDataName: "Optimization DOFs"
          },
          Output: {
            ArgumentName: "Filtered Field",
            SharedDataName: "Topology"
          }
        }
      }
      let tTopologyName = (this.useEngineFilter) ? 'Topology' : 'Optimization DOFs'
      newStage["Stage"][`Operation__${conName}`] = {
        Name: `Compute ${conName} Gradient`,
        PerformerName: "Analyze",
        Input: {
          ArgumentName: "Topology",
          SharedDataName: tTopologyName
        }
      }
      if (this.useEngineFilter) {
        newStage["Stage"][`Operation__${conName}`]['Output'] = {
          ArgumentName: `${conName} Gradient`,
          SharedDataName: `Unfiltered ${conName} Gradient`
        }
      } else {
        newStage["Stage"][`Operation__${conName}`]['Output'] = {
          ArgumentName: `${conName} Gradient`,
          SharedDataName: `${conName} Gradient`
        }
      }
      if (this.useEngineFilter) {
        newStage["Stage"]["Operation__Filter"] = {
          Name: "FilterGradient",
          PerformerName: "PlatoMain",
          Input__0: {
            ArgumentName: "Field",
            SharedDataName: "Optimization DOFs"
          },
          Input__1: {
            ArgumentName: "Gradient",
            SharedDataName: `Unfiltered ${conName} Gradient`
          },
          Output: {
            ArgumentName: "Filtered Gradient",
            SharedDataName: `${conName} Gradient`
          }
        }
      }
      newStage["Stage"]["Output"] = {
        SharedDataName: `${conName} Gradient`
      }
      this.addBranch(newStage, interfaceFile)
      if (this.useEngineFilter) {
        this.addSharedData({Name: `${conName} Gradient`, Type: "Scalar", Layout: "Nodal Field", OwnerName: "PlatoMain", UserName: "PlatoMain"}, interfaceFile)
        this.addSharedData({Name: `Unfiltered ${conName} Gradient`, Type: "Scalar", Layout: "Nodal Field", OwnerName: "Analyze", UserName: "PlatoMain"}, interfaceFile)
      } else {
        this.addSharedData({Name: `${conName} Gradient`, Type: "Scalar", Layout: "Nodal Field", OwnerName: "Analyze", UserName: "PlatoMain"}, interfaceFile)
      }
    }, this)
  }
  setupObjectiveCriteria({analyzeApp}){
    // add the operation to the analyze app file
    this.objectives.forEach((obj) => {
      this.addCriterionOperation(obj, analyzeApp)
    })
  }
  setupObjective({interfaceFile, platoApp}){
    // add stage to interface file
    let newStage = {
      Stage: {
        Name: "Objective",
        Input: {
          SharedDataName: "Optimization DOFs"
        }
      }
    }
    if (this.useEngineFilter) {
      newStage['Stage']['Operation'] = {
        Name: "FilterControl",
        PerformerName: "PlatoMain",
        Input: {
          ArgumentName: "Field",
          SharedDataName: "Optimization DOFs"
        },
        Output: {
          ArgumentName: "Filtered Field",
          SharedDataName: "Topology"
        }
      }
    }
    let tTopologyName = (this.useEngineFilter) ? 'Topology' : 'Optimization DOFs'
    this.objectives.forEach((obj) => {
      let objName = `${obj.scenario.name}:${obj.criterionName}`
      newStage["Stage"][`Operation__${objName}`] = {
        Name: `Compute ${objName} Value`,
        PerformerName: "Analyze",
        Input: {
          ArgumentName: "Topology",
          SharedDataName: tTopologyName
        },
        Output: {
          ArgumentName: `${objName} Value`,
          SharedDataName: objName
        }
      }
      this.addSharedData({Name: objName, Type: "Scalar", Layout: "Global", OwnerName: "Analyze", UserName: "PlatoMain"}, interfaceFile)
    }, this)
    newStage["Stage"]["Operation__Aggregate"] = {
      Name: "AggregateValue",
      PerformerName: "PlatoMain",
    }
    this.objectives.forEach((obj, i) => {
      let objName = `${obj.scenario.name}:${obj.criterionName}`
      newStage["Stage"]["Operation__Aggregate"][`Input__Value${i}`] = {
        ArgumentName: `Value ${i+1}`,
        SharedDataName: objName
      }
      if (this.normalizeObjectives) {
        newStage["Stage"]["Operation__Aggregate"][`Input__Normal${i+1}`] = {
          ArgumentName: `Normal ${i+1}`,
          SharedDataName: `Initial ${objName} Value`
        }
      }
    })
    newStage["Stage"]["Operation__Aggregate"]["Output"] = {
      ArgumentName: "Value",
      SharedDataName: "Objective"
    }
    newStage["Stage"]["Output"] = {
      SharedDataName: "Objective"
    }
    this.addBranch(newStage, interfaceFile)

    this.addSharedData({Name: "Objective", Type: "Scalar", Layout: "Global", OwnerName: "PlatoMain", UserName: "PlatoMain"}, interfaceFile)

    // add value Aggregator
    let tAggregator = {
      Operation: {
        Function: "Aggregator",
        Name: "AggregateValue",
        Report: "true",
        Aggregate: {
          Layout: "Value"
        }
      }
    }
    this.objectives.forEach((obj, i) => {
      tAggregator["Operation"]["Aggregate"][`Input__${i}`] = {
        ArgumentName: `Value ${i+1}`
      }
    })
    tAggregator["Operation"]["Aggregate"]["Output"] = {
      ArgumentName: "Value"
    }
    tAggregator["Operation"]["Weighting"] = {Normals: {}}
    this.objectives.forEach((obj, i) => {
      tAggregator["Operation"]["Weighting"][`Weight__${i}`] = {
        Value: obj.weight
      }
    })
    if (this.normalizeObjectives) {
      this.objectives.forEach((obj, i) => {
        tAggregator["Operation"]["Weighting"]["Normals"][`Input__${i}`] = {
          ArgumentName: `Normal ${i+1}`
        }
      })
    }
    this.addBranch(tAggregator, platoApp)
  }
  setupObjectiveGradient({interfaceFile, platoApp}){
    // add stage to interface file
    let newStage = {
      Stage: {
        Name: "Objective Gradient",
        Input: {
          SharedDataName: "Optimization DOFs"
        }
      }
    }
    if (this.useEngineFilter) {
      newStage['Stage']['Operation'] = {
        Name: "FilterControl",
        PerformerName: "PlatoMain",
        Input: {
          ArgumentName: "Field",
          SharedDataName: "Optimization DOFs"
        },
        Output: {
          ArgumentName: "Filtered Field",
          SharedDataName: "Topology"
        }
      }
    }
    let tTopologyName = (this.useEngineFilter) ? 'Topology' : 'Optimization DOFs'
    this.objectives.forEach((obj) => {
      let objName = `${obj.scenario.name}:${obj.criterionName}`
      newStage["Stage"][`Operation__${objName}`] = {
        Name: `Compute ${objName}${(this.objectives.length === 1 ? ' Gradient' : '')}`, // TODO: until states are cached
        PerformerName: "Analyze",
        Input: {
          ArgumentName: "Topology",
          SharedDataName: tTopologyName
        },
        Output: {
          ArgumentName: `${objName} Gradient`,
          SharedDataName: `${objName} Gradient`
        }
      }
      this.addSharedData({Name: `${objName} Gradient`, Type: "Scalar", Layout: "Nodal Field", OwnerName: "Analyze", UserName: "PlatoMain"}, interfaceFile)
    }, this)
    newStage["Stage"]["Operation__Aggregate"] = {
      Name: "AggregateField",
      PerformerName: "PlatoMain",
    }
    this.objectives.forEach((obj, i) => {
      let objName = `${obj.scenario.name}:${obj.criterionName}`
      newStage["Stage"]["Operation__Aggregate"][`Input__Field${i+1}`] = {
        ArgumentName: `Field ${i+1}`,
        SharedDataName: `${objName} Gradient`
      }
      if (this.normalizeObjectives) {
        newStage["Stage"]["Operation__Aggregate"][`Input__Normal${i+1}`] = {
          ArgumentName: `Normal ${i+1}`,
          SharedDataName: `Initial ${objName} Value`
        }
      }
    })
    newStage["Stage"]["Operation__Aggregate"]["Output"] = {
      ArgumentName: "Field",
      SharedDataName: "Objective Gradient"
    }
    if (this.useEngineFilter) {
      newStage["Stage"]["Operation__Filter"] = {
        Name: "FilterGradient",
        PerformerName: "PlatoMain",
        Input__0: {
          ArgumentName: "Field",
          SharedDataName: "Optimization DOFs"
        },
        Input__1: {
          ArgumentName: "Gradient",
          SharedDataName: "Objective Gradient"
        },
        Output: {
          ArgumentName: "Filtered Gradient",
          SharedDataName: "Objective Gradient"
        }
      }
    }
    newStage["Stage"]["Output"] = {
      SharedDataName: "Objective Gradient"
    }
    this.addBranch(newStage, interfaceFile)

    this.addSharedData({Name: "Objective Gradient", Type: "Scalar", Layout: "Nodal Field", OwnerName: "PlatoMain", UserName: "PlatoMain"}, interfaceFile)

    // add value Aggregator
    let tAggregator = {
      Operation: {
        Function: "Aggregator",
        Name: "AggregateField",
        Aggregate: {
          Layout: "Nodal Field"
        }
      }
    }
    this.objectives.forEach((obj, i) => {
      tAggregator["Operation"]["Aggregate"][`Input__${i}`] = {
        ArgumentName: `Field ${i+1}`
      }
    })
    tAggregator["Operation"]["Aggregate"]["Output"] = {
      ArgumentName: "Field"
    }
    tAggregator["Operation"]["Weighting"] = {Normals: {}}
    this.objectives.forEach((obj, i) => {
      tAggregator["Operation"]["Weighting"][`Weight__${i}`] = {
        Value: obj.weight
      }
    })
    if (this.normalizeObjectives) {
      this.objectives.forEach((obj, i) => {
        tAggregator["Operation"]["Weighting"]["Normals"][`Input__${i}`] = {
          ArgumentName: `Normal ${i+1}`
        }
      })
    }
    this.addBranch(tAggregator, platoApp)
  }
  setupOutputStage({interfaceFile, platoApp, analyzeApp}){
      let newStage = {
        Stage: {
          Name: "Output To File",
        }
      }
      let tMappedTopologyName = "Topology"
      if (this.useEngineFilter === false) {
        newStage['Stage']['Operation__PA'] = {
          Name: "Write Output",
          PerformerName: "Analyze",
          Output: {
            ArgumentName: "Topology",
            SharedDataName: "Mapped Topology"
          }
        }
        tMappedTopologyName = "Mapped Topology"
      }
      newStage['Stage']['Operation'] = {
        Name: "PlatoMainOutput",
        PerformerName: "PlatoMain",
        Input: {
          ArgumentName: "Topology",
          SharedDataName: tMappedTopologyName
        }
      }
      this.addBranch(newStage, interfaceFile)
      let newOperation = {
        Operation: {
          Function: "PlatoMainOutput",
          OutputFrequency: 1,
          Name: "PlatoMainOutput",
          Input__0: {
            ArgumentName: "Topology",
            Alias: "Topology"
          },
          SurfaceExtraction: {
            OutputMethod: "parallel write",
            Discretization: "density",
            BaseName: "design",
            AppendIterationCount: "True",
            Output: {
              Format: "STL"
            }
          }
        }
      }
      this.addBranch(newOperation, platoApp)

      if (this.useEngineFilter === false) {
        let newOperation = {
          Operation: {
            Function: "WriteOutput",
            Name: "Write Output",
            Output: {
              ArgumentName: "Topology"
            }
          }
        }
        this.addBranch(newOperation, analyzeApp)
      }
  }
  setupCacheStateStage({interfaceFile}){
      let newStage = {
        Stage: {
          Name: "Cache State"
        }
      }
      this.addBranch(newStage, interfaceFile)
  }
  setupOptimizer({interfaceFile}) {
    let optData = {}
    optData["Package"] = this.optimizer.selected
    let options = this.optimizer.packages[this.optimizer.selected]
    if (this.optimizer.selected !== "OC") {
      optData["Options"] = {}
      Object.keys(options).forEach((key) => {
        optData['Options'][key] = options[key].value
      })
    } else {
      optData["Convergence"] = { MaxIterations: options["MaxIterations"].value }
    }
    optData["Output"] = {
        OutputStage: "Output To File"
    }
    let tFilteredTopologyName = (this.useEngineFilter) ? 'Topology' : 'Mapped Topology'
    optData["OptimizationVariables"] = {
        ValueName: "Optimization DOFs",
        InitializationStage: "Initialize Optimization",
        FilteredName: tFilteredTopologyName,
        LowerBoundValueName: "Lower Bound Value",
        LowerBoundVectorName: "Lower Bound Vector",
        UpperBoundValueName: "Upper Bound Value",
        UpperBoundVectorName: "Upper Bound Vector",
        SetLowerBoundsStage: "Set Lower Bounds",
        SetUpperBoundsStage: "Set Upper Bounds"
    }
    optData["Objective"] = {
        ValueName: "Objective",
        ValueStageName: "Objective",
        GradientName: "Objective Gradient",
        GradientStageName: "Objective Gradient"
    }
    let constraint = this.constraints[0]
    let conName = `${constraint.scenario.name}:${constraint.criterionName}`
    optData["Constraint"] = {
        ValueName: conName,
        ValueStageName: conName,
        GradientName: `${conName} Gradient`,
        GradientStageName: `${conName} Gradient`
    }
    if (constraint.perVolume) {
        optData["Constraint"]["ReferenceValueName"] = "Design Volume"
        optData["Constraint"]["NormalizedTargetValue"] = constraint.target
    } else {
        optData["Constraint"]["TargetValue"] = constraint.target
    }
    this.addBranch({Optimizer: optData}, interfaceFile)
  }
  inputFileName(aName){
    return `${aName.replace(" ", "_")}.xml`
  }
  uniqueScenarios() {
    let uniqueScenarios = []
    this.constraints.forEach((con) => {
      let index = uniqueScenarios.findIndex((s) => s.name === con.scenario.name )
      if (index === -1) {
        uniqueScenarios.push(con.scenario)
      }
    })
    this.objectives.forEach((obj) => {
      let index = uniqueScenarios.findIndex((s) => s.name === obj.scenario.name )
      if (index === -1) {
        uniqueScenarios.push(obj.scenario)
      }
    })
    return uniqueScenarios
  }
  uniqueModels() {
    let uniqueScenarios = this.uniqueScenarios()
    let uniqueModels = []
    uniqueScenarios.forEach((scenario) => {
      let modelName = scenario.geometry.body.modelName
      let index = uniqueModels.findIndex((m) => m === modelName )
      if (index === -1) {
        uniqueModels.push(modelName)
      }
    })
    return uniqueModels
  }
  setSymmetry(modelName, direction, isSym) {
    let index = this.symmetry.findIndex( entry => entry.modelName === modelName )
    if (index !== -1) {
      if (direction in this.symmetry[index]) {
        this.symmetry[index][direction] = isSym
      } else {
        throw "setSymmetry: attempted to set symmetry in unknown direction"
      }
    } else {
      throw "setSymmetry: model not found"
    }
  }
  setFixedBlock(modelName, blockName, isFixed) {
    let modelIndex = this.fixedBlocks.findIndex( model => model.modelName === modelName )
    if (modelIndex !== -1) {
      let modelFixedBlocks = this.fixedBlocks[modelIndex].blockNames
      let index = modelFixedBlocks.findIndex( name => name === blockName )
      if (isFixed) {
        if (index === -1) {
          modelFixedBlocks.push(blockName)
        }
      } else {
        if (index !== -1) {
          modelFixedBlocks.splice(index, 1)
        }
      }
    }
  }
  indicesFromBlocks(blocks, models) {
    let indices = []
    blocks.forEach( entry => {
      let modelIndex = models.findIndex( m => m.name === entry.modelName )
      if (modelIndex !== -1) {
        let model = models[modelIndex]
        let blockNames = entry.blockNames
        blockNames.forEach( blockName => {
          model.primitives.forEach( p => {
            if (p.type === 'block' && p.definition.Name === blockName) {
              indices.push(p.definition.ID)
            }
          })
        })
      }
    })
    return indices
  }
  toDOM (models) {
    let retVal = {}


    let config = {
      interfaceFile: new XMLWriter(true),
      platoApp: new XMLWriter(true),
      platoInput: new XMLWriter(true),
      analyzeApp: new XMLWriter(true)
    }

    let uniqueScenarios = this.uniqueScenarios()
    
    // write analyzeInput file for each scenario
    uniqueScenarios.forEach((scenario) => {
      retVal[this.inputFileName(scenario.name)] = scenario.toDOM()
    }, this)

    this.setupConsole(config)
    this.setupPerformers(config)
    this.setupSharedData(config)

    let fixedIndices = this.indicesFromBlocks(this.fixedBlocks, models)
    this.setupBounds(config, fixedIndices)

    this.setupFilter(config)

    this.setupObjectiveCriteria(config)
    this.setupObjective(config)
    this.setupObjectiveGradient(config)

    this.setupConstraintCriteria(config)
    this.setupConstraint(config)
    this.setupConstraintGradient(config)

    this.setupInitialization(config)
    this.setupDesignVolumeStage(config)

    this.setupOutputStage(config)

    this.setupCacheStateStage(config)

    this.setupOptimizer(config)


    retVal["mpirun.source"] = this.writeMpirunSourceFile(uniqueScenarios)
    retVal["interface.xml"] = config.interfaceFile.toString()
    retVal["platoInput.xml"] = this.writePlatoInputFile(config.platoInput)
    retVal["platoApp.xml"] = config.platoApp.toString()
    retVal["analyzeApp.xml"] = config.analyzeApp.toString()
    retVal["amgx.json"] = JSON.stringify(this.getAmgxSettings(), null, 4)
 

    let meshes = models.map(model => {return {file: model.file, fileName: model.fileName, remote: model.remote}})
    return {files: retVal, meshes: meshes}
  }
  getAmgxSettings() {
    return {
      config_version: 2,
      determinism_flag: 1,
      solver: {
        preconditioner: {
            print_grid_stats: 1,
            algorithm: "AGGREGATION",
            print_vis_data: 0,
            solver: "AMG",
            smoother: {
                relaxation_factor: 0.8,
                scope: "jacobi",
                solver: "BLOCK_JACOBI",
                monitor_residual: 0,
                print_solve_stats: 0
            },
            print_solve_stats: 0,
            presweeps: 0,
            selector: "SIZE_8",
            coarse_solver: "NOSOLVER",
            max_iters: 1,
            monitor_residual: 0,
            store_res_history: 0,
            scope: "amg",
            max_levels: 100,
            postsweeps: 4,
            cycle: "V"
        },
        solver: this.solver.solver.value,
        print_solve_stats: 0,
        obtain_timings: 1,
        max_iters: parseInt(this.solver.max_iters.value),
        monitor_residual: 1,
        convergence: "ABSOLUTE",
        scope: "main",
        tolerance: parseFloat(this.solver.tolerance.value),
        norm: "L2"
      }
    }
  }
  addObjective(scenario, criterionName, weight) {
    this.objectives.push({scenario: scenario, criterionName: criterionName, weight: weight}) 

    let uniqueModels = this.uniqueModels()
    uniqueModels.forEach(modelName => {
      let modelIndex = this.fixedBlocks.findIndex( model => model.modelName === modelName )
      if (modelIndex === -1) {
        this.fixedBlocks.push({modelName: modelName, blockNames: []})
      }
      let index = this.symmetry.findIndex( entry => entry.modelName === modelName )
      if (index === -1 ){
        this.symmetry.push({modelName: modelName, X: false, Y: false, Z: false})
      }
    })
  }
  addConstraint(scenario, criterionName, target, perVolume) {
    this.constraints.push({scenario: scenario, criterionName: criterionName, target: target, perVolume: perVolume}) 

    let uniqueModels = this.uniqueModels()
    uniqueModels.forEach(modelName => {
      let modelIndex = this.fixedBlocks.findIndex( model => model.modelName === modelName )
      if (modelIndex === -1) {
        this.fixedBlocks.push({modelName: modelName, blockNames: []})
      }
      let index = this.symmetry.findIndex( entry => entry.modelName === modelName )
      if (index === -1 ){
        this.symmetry.push({modelName: modelName, X: false, Y: false, Z: false})
      }
    })
  }
}

export default Optimization
