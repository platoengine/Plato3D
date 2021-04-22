<!--
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
-->
<template>
  <div class = "plot">
    <Plotly :data="plotData" @doubleclick = "openPlot()" :layout="thumbnailLayout" :display-mode-bar="false"></Plotly>
    <v-dialog v-model="plotOpen" persistent max-width="500px">
      <Plotly :data="plotData" :layout="openGraphLayout" :display-mode-bar="false"></Plotly> 
      <v-btn block @click="plotOpen=false">Close</v-btn>
    </v-dialog>
  </div>
</template>
<script>
import { Plotly } from 'vue-plotly'

export default {
  name : 'plot',
  components: {
    Plotly
  },
  props : ['optimizationName'],
  data: function(){
    return{
      thumbnailLayout:{
        title: "Convergence Plot",
        yaxis: { fixedrange: true },
        xaxis: { fixedrange: true },
        height: 100,
        width: 202,
        font :{
          size :10
        },
        margin : { l:20, r:20, b:20, t:25, pad:0 }
      },
      openGraphLayout:{
      title: "Convergence Plot",
        yaxis: { fixedrange: true },
        xaxis: { fixedrange: true },
        height: 500,
        width: 500,
        font :{
          size :10
        },
        margin : { l:50, r:50, b:50, t:70, pad:0 }
      },
      staticPlot: true,
      plotOpen: false
    }
  },
  computed: {
    plotData: function () {
      let optimizationIndex = this.$store.state.optimizations.findIndex(optimization => optimization.name === this.optimizationName)
      return this.$store.state.optimizations[optimizationIndex].convergenceData
    }
  },
  watch: {
    plotData: function () {
    }
  },
  methods: {
    openPlot: function(){
      this.plotOpen = true
    }
  }  
}

</script>
