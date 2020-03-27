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
    }
  }
}
</script>
