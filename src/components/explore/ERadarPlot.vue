<template>
  <v-container class="ma-0 pa-0">
    <v-row no-gutters>
      <v-col cols="2">
        <v-expansion-panels :focusable=true accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>Designs</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card v-for="(entry, index) in fullset.data" :key=index outlined class="ma-1 pa-1">
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
              <p-axis-control v-for="(entry, index) in fullset.axes"
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
            name: '',
            type: 'radar',
            data: []
          }
        ]
      },
      fullset: {
        axes: [
          { active: true, min: 0.5,   max: 0.9,   name: 'Volume Fraction' },
          { active: true, min: 1e6,   max: 1e7,   name: 'VM Stress (MPa), Scenario 0' },
          { active: true, min: 100.0, max: 600.0, name: 'Compliance (m/N), Scenario 0' },
          { active: true, min: 1e6,   max: 1e7,   name: 'VM Stress (MPa), Scenario 1' },
          { active: true, min: 100.0, max: 600.0, name: 'Compliance (m/N), Scenario 1' }
        ],
        name: 'Aggregate Performance',
        data: [
          {
            active: true,
            value: [0.6, 2.5e6, 400.0, 4.0e6, 500.0],
            name: 'Design 0'
          },
          {
            active: true,
            value: [0.8, 2.0e6, 300.0, 3.4e6, 400.0],
            name: 'Design 1'
          }
        ]
      },
      view: {
        dataLabels: true
      }
    };
  },
  methods: {
    processClick: function(params) {
      console.log(params)
    },
    getDataVisibility: function (index) {
      return this.fullset.data[index].active
    },
    setDataVisibility: function (index, newState) {
      this.fullset.data[index].active = newState
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
      return this.fullset.axes[index].active
    },
    setAxisState: function (index, newState) {
      this.fullset.axes[index].active = newState
      this.sync()
    },
    getAxisMin: function (index) {
      return this.fullset.axes[index].min
    },
    setAxisMin: function (index, newState) {
      this.fullset.axes[index].min = newState
      this.sync()
    },
    getAxisMax: function (index) {
      return this.fullset.axes[index].max
    },
    setAxisMax: function (index, newState) {
      this.fullset.axes[index].max = newState
      this.sync()
    },
    sync: function () {
      let activeData = this.fullset.data.filter((datum) => datum.active === true)

      this.option.legend.data = activeData.map((datum) => datum.name)
      this.option.radar.indicator = this.fullset.axes.filter((datum) => datum.active === true)
      this.option.series[0].name = this.fullset.name
      
      this.option.series[0].data.length = 0 // empty the data array
      activeData.forEach((datum) => {
        const value = datum.value.filter((value, valIndex) => this.fullset.axes[valIndex].active, this)
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
