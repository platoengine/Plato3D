<template>
      <v-tabs class="fill-height" color=rgba(59,191,51,0.9) background-color=rgba(90,90,90,0.5) vertical  icons-and-text centered>
        <v-tab class="px-0 mx-0" v-on:click="setDefaultWidth()">
          Models
          <v-icon x-large>$vuetify.icons.models</v-icon>
        </v-tab>
        <v-tab-item>
          <model-tree/>
        </v-tab-item>

        <v-tab class="px-0 mx-0" v-on:click="setDefaultWidth()">
          Scenarios
          <v-icon x-large>$vuetify.icons.scenarios</v-icon>
        </v-tab>
        <v-tab-item>
          <scenario-tree/>
        </v-tab-item>

        <v-tab class="px-0 mx-0" v-on:click="setDefaultWidth()">
          Realize
          <v-icon x-large>$vuetify.icons.realize</v-icon>
        </v-tab>

        <v-tab-item>
          <realization-tree/>
        </v-tab-item>

        <v-tab class="px-0 mx-0" v-on:click="setDefaultWidth()">
          Optimize
          <v-icon x-large>$vuetify.icons.optimize</v-icon>
        </v-tab>

        <v-tab-item>
          <optimization-tree/>
        </v-tab-item>

        <v-tab class="px-0 mx-0" v-on:click="setFullWidth()">
          Explore
          <v-icon x-large>$vuetify.icons.explore</v-icon>
        </v-tab>

        <v-tab-item>
          <explore-view/>
        </v-tab-item>

      <v-spacer></v-spacer>
      </v-tabs>
</template>

<script>
import ModelTree from './models/ModelTree'
import ScenarioTree from './scenarios/ScenarioTree'
import RealizationTree from './realizations/RealizationTree'
import OptimizationTree from './optimizations/OptimizationTree'
import ExploreView from './explore/ExploreView'

export default {
    name: 'Control',
    components: {
      ModelTree,
      ScenarioTree,
      RealizationTree,
      OptimizationTree,
      ExploreView
    },
    data: () => ({
    }),
    methods: {
      setFullWidth(){
        this.$emit('set-width', '100%')
      },
      setDefaultWidth(){
        this.$emit('set-width', 293)
      }
    }
};
</script>
