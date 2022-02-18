<template>
  <v-container class="ma-0 pa-0">
    <v-row no-gutters>
      <v-col cols="2">
        <v-expansion-panels :focusable=true accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>Designs</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card v-for="(entry, index) in allData" :key=index outlined class="ma-1 pa-1">
                <v-card-title class="ma-0 pa-0 overline">{{ entry.name }}</v-card-title>
                <v-container class="ma-0 py-1">
                  <v-row no-gutters>
                  <v-col class="px-2">
                    <p-checkbox dense class="ma-0 pa-0"
                      label="Visible"
                      :state="getDataVisibility(index)"
                      @change-state="setDataVisibility(index, $event)"/>
                  </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Criteria</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p-axis-control v-for="(entry, index) in allAxes"
                :key="index"
                :label="entry.name"
                :state="getAxisState(index)"
                @change-state="setAxisState(index, $event)"
                :min="getAxisMin(index)"
                @change-min="setAxisMin(index, $event)"
                :max="getAxisMax(index)"
                @change-max="setAxisMax(index, $event)" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Display Options</v-expansion-panel-header>
            <v-expansion-panel-content>
            <p-checkbox label="Label Points"
              :state="getLabelPoints()"
              @change-state="setLabelPoints($event)" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="4">
        <v-chart class="chart" :option="option" v-on:click="processClick" autoresize />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { RadarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import PCheckbox from '../ui/PCheckbox'
import PAxisControl from './PAxisControl'

use([
  CanvasRenderer,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

let optionToContent = function(opt) {
    let columnTitles = opt.radar[0].indicator
    let rowTitles = opt.legend[0].data
    let rowData = opt.series[0].data
    let table = '<table style="width:100%;text-align:center"><tbody><tr><th>Design</th>'
    for (let i = 0, l = columnTitles.length; i < l; i++) {
      table += '<th>' + columnTitles[i].name + '</th>'
    }
    table += '</tr>'
    for (let i = 0, l = rowTitles.length; i < l; i++) {
      table += '<tr><td>' + rowTitles[i] + '</td>'
      for (let j = 0, J = rowData[i].value.length; j < J; j++) {
        table += '<td>' + rowData[i].value[j] + '</td>'
      }
      table += '</tr>'
    }
    table += '</tbody></table>';
    return table;
}

export default {
  name: "ERadarPlot",
  components: {
    VChart,
    PCheckbox,
    PAxisControl
  },
  provide: {
    [THEME_KEY]: "dark"
  },
  mounted () {
    this.sync()
  },
  data() {
    return {
      option: {
        textStyle: {
          fontSize: 20,
        },
        legend: {
          data: []
        },
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        toolbox: {
          left: 'center',
          bottom: '0%',
          feature: {
            dataView: {
              readOnly: false,
              backgroundColor: '#999999',
              textareaColor: '#999999',
              buttonColor: '#444444',
              optionToContent: optionToContent
            },
            restore: {show: false},
            saveAsImage: {
              name: 'DesignData'
            }
          }
        },
        radar: {
          shape: 'circle',
          indicator: [],
          splitArea: {
            areaStyle: {
              color: ['#1a1a1a', '#100b2a'],
              shadowColor: 'rgba(0, 0, 0, 1.0)',
              shadowBlur: 20
            }
          },
        },
        series: [
          {
            lineStyle: {
              width: 5
            },
            name: 'Performance',
            type: 'radar',
            data: []
          }
        ]
      },
      view: {
        dataLabels: true
      }
    };
  },
  computed: {
    updateState: function () {
      return this.$store.state.explorerData.changed
    },
    allData: {
      get: function () {
        return this.$store.state.explorerData.data
      },
      set: function () {
        // no-op
      }
    },
    allAxes: {
      get: function () {
        return this.$store.state.explorerData.axes
      },
      set: function () {
        // no-op
      }
    },
  },
  watch: {
    updateState: function ( newState ) {
      if (newState === true) {
        this.$store.commit('setSessionDataState', false)
        this.sync()
      }
    }
  },
  methods: {
    processClick: function(params) {
      console.log(params)
    },
    getDataVisibility: function (index) {
      return this.$store.state.explorerData.data[index].active
    },
    setDataVisibility: function (index, newState) {
      this.$store.commit('setDataVisibility', {index, newState})
      this.sync()
    },
    getLabelPoints: function () {
      return this.view.dataLabels
    },
    setLabelPoints: function (newState) {
      this.view.dataLabels = newState
      this.sync()
    },
    getAxisState: function (index) {
      return this.$store.state.explorerData.axes[index].active
    },
    setAxisState: function (index, newState) {
      this.$store.commit('setAxisState', {index, newState})
      this.sync()
    },
    getAxisMin: function (index) {
      return this.$store.state.explorerData.axes[index].min
    },
    setAxisMin: function (index, newState) {
      this.$store.commit('setAxisMin', {index, newState})
      this.sync()
    },
    getAxisMax: function (index) {
      return this.$store.state.explorerData.axes[index].max
    },
    setAxisMax: function (index, newState) {
      this.$store.commit('setAxisMax', {index, newState})
      this.sync()
    },
    sync: function () {
      let activeData = this.$store.state.explorerData.data.filter((datum) => datum.active === true)

      this.option.legend.data = activeData.map((datum) => datum.name)
      this.option.radar.indicator = this.$store.state.explorerData.axes.filter((datum) => datum.active === true)
      
      this.option.series[0].data.length = 0 // empty the data array
      activeData.forEach((datum) => {
        const value = datum.value.filter((value, valIndex) => this.$store.state.explorerData.axes[valIndex].active, this)
        this.option.series[0].data.push({name: datum.name, value: value, label: {show: this.view.dataLabels}})
      }, this)
    }
  }
};
</script>

<style scoped>
.chart {
  height: 90vh;
  width: 80vw; 
}
.scrollable {
   overflow-y: scroll;
}
</style>

<style>
body {
  margin: 0;
}
</style>
