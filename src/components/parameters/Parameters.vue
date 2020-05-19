<template>
  <v-card color=green>
  <v-card outlined class="ml-2">
    <new-parameter :parentObject="parentObject"/>
    <v-expansion-panels :focusable=true accordion>
      <v-expansion-panel v-for="(item, index) in parentObject.parameters" :key="index">
        <v-expansion-panel-header>{{item.ParameterName}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card color=green>
          <v-card outlined class="ml-2">
            <modify-parameter :parentObject="parentObject" :parameterName="item.ParameterName"/>
          </v-card>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
  </v-card>
</template>

<script>
import NewParameter from './NewParameter'
import ModifyParameter from './ModifyParameter'

export default {
  name: 'parameters',
  props: ['parentObject'],
  components: {
    NewParameter,
    ModifyParameter
  },
  data: function () {
    return {
      openParameters: false,
      visibleNewParameterPanel: false,
      display: {from: 0, num: 3}
    }
  }
}
</script>
