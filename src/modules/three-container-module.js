import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

function ThreeContainer () {
  this.renderer = {}
  this.scene = {}
  this.camera = {}
  this.controls = {}
  this.raycaster = {}
  this.mouse = {}
  this.boundingbox = {}

  this.isInitialized = false

  this.initialize = function () {
    if (!this.isInitialized) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setSize(window.innerWidth, window.innerHeight - 6)
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      this.scene = new THREE.Scene()
      this.grid = {X: null, Y: null, Z: null}
      this.lighting = {directional: null, hemisphere: null, ambient: null, spot: null}
      this.camera = new THREE.PerspectiveCamera(75, (window.innerWidth) / (window.innerHeight - 6), 0.1, 1000)
      this.camera.position.z = 5
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.mouse = new THREE.Vector2()
      let min = new THREE.Vector3(-5.0,-5.0,-5.0)
      let max = new THREE.Vector3( 5.0, 5.0, 5.0)
      this.boundingbox = new THREE.Box3(min, max)
      this.raycaster = new THREE.Raycaster()

      this.isInitialized = true
    }
  }

  this.setBoundingBox = function (primitives) {
    this.boundingbox = new THREE.Box3()
    primitives.forEach((p) => { this.boundingbox.expandByObject(this.scene.getObjectById(p.primitiveObjectID)) }, this)
  }

  this.getGridSize = function () {
    let sizes = [this.boundingbox.max.x - this.boundingbox.min.x,
                 this.boundingbox.max.y - this.boundingbox.min.y,
                 this.boundingbox.max.z - this.boundingbox.min.z]
    if (sizes[0] > sizes[1] && sizes[0] > sizes[2]) { return 2.0*sizes[0] }
    if (sizes[1] > sizes[2] && sizes[1] > sizes[0]) { return 2.0*sizes[1] }
    if (sizes[2] > sizes[0] && sizes[2] > sizes[1]) { return 2.0*sizes[2] }
  }

  this.setGrid = function (sceneSettings) {
    const {size, divs, showX, showY, showZ, AtCenter} = sceneSettings
    if (this.grid.X != null) {
      this.scene.remove(this.grid.X)
    }
    if (showX) {
      this.grid.X = new THREE.GridHelper(size, divs, 0xff0000, 0x994444)
      this.grid.X.rotation.z = Math.PI * 0.5
      this.grid.X.position.x = (this.boundingbox.max.x + this.boundingbox.min.x)/2.0
      this.grid.X.position.y = (this.boundingbox.max.y + this.boundingbox.min.y)/2.0
      this.grid.X.position.z = (this.boundingbox.max.z + this.boundingbox.min.z)/2.0
      if (!AtCenter) {
        this.grid.X.position.x -= size/2.0
      }
      this.scene.add(this.grid.X)
    }
    if (this.grid.Y != null) {
      this.scene.remove(this.grid.Y)
    }
    if (showY) {
      this.grid.Y = new THREE.GridHelper(size, divs, 0x00ff00, 0x449944)
      this.grid.Y.position.x = (this.boundingbox.max.x + this.boundingbox.min.x)/2.0
      this.grid.Y.position.y = (this.boundingbox.max.y + this.boundingbox.min.y)/2.0
      this.grid.Y.position.z = (this.boundingbox.max.z + this.boundingbox.min.z)/2.0
      if (!AtCenter) {
        this.grid.Y.position.y -= size/2.0
      }
      this.scene.add(this.grid.Y)
    }
    if (this.grid.Z != null) {
      this.scene.remove(this.grid.Z)
    }
    if (showZ) {
      this.grid.Z = new THREE.GridHelper(size, divs, 0x0000ff, 0x444499)
      this.grid.Z.rotation.x = Math.PI * 0.5
      this.grid.Z.position.x = (this.boundingbox.max.x + this.boundingbox.min.x)/2.0
      this.grid.Z.position.y = (this.boundingbox.max.y + this.boundingbox.min.y)/2.0
      this.grid.Z.position.z = (this.boundingbox.max.z + this.boundingbox.min.z)/2.0
      if (!AtCenter) {
        this.grid.Z.position.z -= size/2.0
      }
      this.scene.add(this.grid.Z)
    }
  }

  this.setLighting = function ({directional, hemisphere, ambient, spot}) {
    if (this.lighting.directional != null) {
      this.scene.remove(this.lighting.directional)
    }
    if (directional.display) {
      this.lighting.directional = new THREE.DirectionalLight(0xffffff)
      this.lighting.directional.position.set(directional.X, directional.Y, directional.Z).normalize()
      this.scene.add(this.lighting.directional)
    }
    if (this.lighting.hemisphere != null) {
      this.scene.remove(this.lighting.hemisphere)
    }
    if (hemisphere.display) {
      this.lighting.hemisphere = new THREE.HemisphereLight(0x606060, 0x404040)
      this.scene.add(this.lighting.hemisphere)
    }
    if (this.lighting.ambient != null) {
      this.scene.remove(this.lighting.ambient)
    }
    if (ambient.display) {
      this.lighting.ambient = new THREE.AmbientLight(0x101010)
      this.scene.add(this.lighting.ambient)
    }
    if (this.lighting.spot != null) {
      this.scene.remove(this.lighting.spot)
    }
    if (spot.display) {
      this.lighting.spot = new THREE.SpotLight(0xffffff, 1)
      this.lighting.spot.position.set(spot.X, spot.Y, spot.Z)
      this.lighting.spot.angle = spot.angle * 2.0 * Math.PI / 360.0
      this.lighting.spot.penumbra = 0.05
      this.lighting.spot.decay = 2
      this.lighting.spot.distance = 200
      this.lighting.spot.castShadow = true
      this.lighting.spot.shadow.mapSize.width = 1024
      this.lighting.spot.shadow.mapSize.height = 1024
      this.lighting.spot.shadow.camera.near = 10
      this.lighting.spot.shadow.camera.far = 200
      this.scene.add(this.lighting.spot)
    }
  }
}

export default ThreeContainer
