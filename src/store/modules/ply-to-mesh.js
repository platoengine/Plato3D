import * as THREE from 'three'

export function PLYToMesh (geometry) {
  geometry.computeVertexNormals()
  let material = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors: THREE.VertexColors})
  material.side = THREE.DoubleSide
  let mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}
