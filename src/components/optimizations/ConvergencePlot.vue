<template>
  <div>
  <v-card v-if="!plotOpen" outlined height=200 class="ma-2 pa-0">
    <v-chart class="chart" :option="option" v-on:dblclick="togglePopOut()" autoresize />
  </v-card>
  <v-btn v-if="!plotOpen" x-small block @click="togglePopOut()">Pop Out</v-btn>
  <v-card class="ma-0 pa-0">
    <v-dialog v-model="plotOpen" persistent max-width="500px">
      <v-card outlined height="300px" class="ma-1 pa-1">
        <v-chart class="chart" :option="option" v-on:dblclick="togglePopOut()" autoresize />
      </v-card>
      <v-card class="ma-0 pa-0">
        <v-btn x-small block @click="togglePopOut()">Close</v-btn>
      </v-card>
    </v-dialog>
  </v-card>
  </div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
  CanvasRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent
]);

export default {
  name : 'plot',
  components: {
    VChart
  },
  props : ['optimizationName'],
  provide: {
    [THEME_KEY]: "dark"
  },
  beforeCreate: function () {
  },
  data: function(){
    return {
      option: {
        backgroundColor: '#555',
        grid: {
          left: '17%',
          top: '15%',
          right: '7%',
          bottom: '12%'
        },
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        toolbox: {
          left: 'center',
          feature: {
            dataView: {show: false, readOnly: true, backgroundColor: '#999999', textareaColor: '#999999', buttonColor: '#444444'},
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {show: false},
            saveAsImage: {
              name: 'Convergence'
            }
          }
        },
        xAxis: {},
        yAxis: {},
        series: [
          {
            color: '#5b5',
            symbolSize: 4,
            data: [],
            type: 'scatter'
          }
        ]
      },
      plotOpen: false
    }
  },
  mounted () {
    this.replot()
  },
  computed: {
    plotDataLength: function () {
      const optimizationIndex = this.$store.state.optimizations.findIndex(optimization => optimization.name === this.optimizationName)
      return this.$store.state.optimizations[optimizationIndex].convergenceData.x.length
    }
  },
  watch: {
    plotDataLength: function () {
      this.replot()
    }
  },
  methods: {
    replot: function () {
      this.option.series[0].data.length = 0
      const optimizationIndex = this.$store.state.optimizations.findIndex(optimization => optimization.name === this.optimizationName)
      const plotData = this.$store.state.optimizations[optimizationIndex].convergenceData
      plotData.x.forEach((datum, index) => {
        this.option.series[0].data.push([datum, plotData.y[index]])
      }, this)
    },
    togglePopOut: function(){
      this.plotOpen = !(this.plotOpen)
      this.option.toolbox.feature.dataView.show = this.plotOpen
    }
  }  
}

</script>

<style scoped>
.chart {
  height: 100vh;
  width: 80vw;
}
