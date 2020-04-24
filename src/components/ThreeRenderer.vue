<template>
  <div>
    <div ref="container"></div>
  </div>
</template>

<script>
export default {
  name: 'three-renderer',

  mounted () {
    this.$refs.container.appendChild(this.$graphics.renderer.domElement)
    this.animate()
    window.addEventListener('mousemove', this.onMouseMove, false)
    window.addEventListener('resize', this.onWindowResize, false)
    window.addEventListener('beforeunload', function (e) {
      e.preventDefault()
      e.returnValue = ''
    })
    document.addEventListener('contextmenu', this.onContextMenu, false)
  },
  methods: {
    animate () {
      requestAnimationFrame(this.animate)
      this.$graphics.controls.update()
      this.$graphics.renderer.render(this.$graphics.scene, this.$graphics.camera)
    },
    onMouseMove (event) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      event.preventDefault()
      this.$graphics.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.$graphics.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    },
    onWindowResize () {
      this.$graphics.camera.aspect = (window.innerWidth) / (window.innerHeight - 6)
      this.$graphics.camera.updateProjectionMatrix()
      this.$graphics.renderer.setSize(window.innerWidth, window.innerHeight - 6)
    },
    onContextMenu (event) {
      if (event.ctrlKey === true) {
        this.$graphics.mouse.x = (event.clientX / this.$graphics.renderer.domElement.clientWidth) * 2 - 1
        this.$graphics.mouse.y = -(event.clientY / this.$graphics.renderer.domElement.clientHeight) * 2 + 1
        if (this.$graphics.mouse.x > 1.0) return
        this.$graphics.raycaster.setFromCamera(this.$graphics.mouse, this.$graphics.camera)
        const models = this.$store.state.models
        models.forEach(function (model) {
          for (var j = 0; j < model.primitives.length; j++) {
            const thisPrimitive = model.primitives[ j ]
            const restoreColor = thisPrimitive.definition.Operation === 'add' ? 0x00ff00 : 0xff0000
            const primitiveObject = this.$graphics.scene.getObjectById(thisPrimitive.primitiveObjectID)
            primitiveObject.children.forEach(function (kid) { kid.material.color.set(restoreColor) })
          }
          const intersectables = model.primitives.map(a => this.$graphics.scene.getObjectById(a.primitiveObjectID), this)
          const intersects = this.$graphics.raycaster.intersectObjects(intersectables, true)
          if (intersects.length > 0) {
            const intersected = intersects[ 0 ]
            const pFace = intersected.object
            const pGroup = pFace.parent
            const tIndex = model.primitives.findIndex(p => p.primitiveObjectID === pGroup.id)
            if (tIndex !== -1) {
//              this.$store.commit('setActiveModel', model.name)
              if (event.shiftKey === true) {
                pFace.material.color.setHex(0x999999)
                this.$store.commit('openSelected', {model: model, primitive: model.primitives[tIndex], surface: pFace})
                this.$store.commit('setSelected', {model: model, group: pGroup, surface: pFace})
              } else {
                pGroup.children.forEach(function (kid) { kid.material.color.set(0x999999) })
                this.$store.commit('openSelected', {model: model, primitive: model.primitives[tIndex], surface: null})
                this.$store.commit('setSelected', {model: model, group: pGroup, surface: null})
              }
            }
          }
        }, this)
      }
    },

  }
}
</script>
