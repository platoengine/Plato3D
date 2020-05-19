<template>
      <v-tabs class="fill-height" color=rgba(59,191,51,0.9) background-color=rgba(90,90,90,0.5) vertical>
        <v-tab class="px-0 mx-0">
          <v-icon dense left>mdi-shape-outline</v-icon>
        </v-tab>
        <v-tab-item>
          <model-tree/>
        </v-tab-item>

        <v-tab class="px-0 mx-0">
          <v-icon dense left>mdi-wrench-outline</v-icon>
        </v-tab>
        <v-tab-item>
          <scenario-tree/>
        </v-tab-item>

      <v-spacer></v-spacer>
      </v-tabs>
</template>

<script>
import ModelTree from './models/ModelTree'
import ScenarioTree from './scenarios/ScenarioTree'

export default {
    name: 'Control',
    components: {
      ModelTree,
      ScenarioTree
    },
    data: () => ({
    })
};
</script>
