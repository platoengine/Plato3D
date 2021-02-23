<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<template>
 <div class = "plot">
  <Plotly @doubleclick = "openPlot()" :layout="thumbnailLayout" :display-mode-bar="false"></Plotly>
   <v-dialog v-model="plotOpen" persistent max-width="500px">
  <Plotly :layout="openGraphLayout" :display-mode-bar="false"></Plotly> 
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
  //props : ['optimizationName'],
  data: function(){
    return{
      thumbnailLayout:{
        title: "Convergence Plot",
        yaxis: {fixedrange: true},
        xaxis:{fixedrange:true},
        height: 100,
        width: 202,
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
      },
      openGraphLayout:{
      title: "Convergence Plot",
        yaxis: {fixedrange: true},
        xaxis:{fixedrange:true},
        //autosize:true,
        height: 500,
        width: 500,
        font :{
          size :10
        },
        margin : {
          l:50,
          r:50,
          b:50,
          t:70,
          pad:0
        }
      },
      //Plot Data Format
      /*data:[{
       // x: this.$store.convergencePlotDataX[this.optimizationName],
        //y: this.$store.convergencePlotDataY[this.optimizationName],
        //x: ['1','5','10','1000000000000'],
        //y: ['1','5','10', '1000000000000'],
        type:"scatter",
        marker: {
          color: 'rgb(75, 174, 79)',
          size: 12
        }
      }],*/
      staticPlot: true,
      plotOpen: false,
      convData : []
    }
  },
 methods :{
    openPlot: function(){
      this.plotOpen = true
    }
  }  
}

</script>