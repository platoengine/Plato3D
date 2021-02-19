<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<template>
  <Plotly :data="data" :layout="layout" :display-mode-bar="false"></Plotly>
</template>
<script>
import { Plotly } from 'vue-plotly'

export default {
  name : 'plot',
  components: {
    Plotly
  },
  props : ['x', 'y'],
  data: function(){
    return{
      data:[{
        //x: this.$store.convergencePlotDataX[0],
        //y: this.$store.convergencePlotDataY[0],
        x: ['1','5','10','1000000000'],
        y: ['1','5','10', '1000000000'],
        type:"scatter",
        marker: {
          color: 'rgb(75, 174, 79)',
          size: 12
        }
      }],
      layout:{
        title: "Convergence Plot",
        height : "100",
        font :{
          size :10
        },
        margin : {
          l:20,
          r:20,
          b:20,
          t:25,
          pad:0
        }//,
        //paper_bgcolor: '#7f7f7f',
        //plot_bgcolor: '#c7c7c7'
      }
    }
  }
}
</script>