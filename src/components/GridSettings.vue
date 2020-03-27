<template>
  <v-card class="mx-0 px-5">
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field class="ma-0 pa-0" v-model="size" label="Size"/>
            <v-text-field class="ma-0 pa-0" v-model="divs" label="Divs"/>
            <v-checkbox class="ma-0 pa-0" :label="`X: ${displayGridX.toString()}`" v-model="displayGridX"/>
            <v-checkbox class="ma-0 pa-0" :label="`Y: ${displayGridY.toString()}`" v-model="displayGridY"/>
            <v-checkbox class="ma-0 pa-0" :label="`Z: ${displayGridZ.toString()}`" v-model="displayGridZ"/>
            <v-btn @click="apply" small>Apply</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'grid-settings',
  data: function () {
    return {
      size: 40,
      divs: 40,
      displayGridX: false,
      displayGridY: false,
      displayGridZ: true
    }
  },
  created: function () {
    this.apply()
  },
  methods: {
    apply: function () {
      this.$graphics.setGrid({
        size: this.size,
        divs: this.divs,
        showX: this.displayGridX,
        showY: this.displayGridY,
        showZ: this.displayGridZ
      })
    }
  }
}
</script>
