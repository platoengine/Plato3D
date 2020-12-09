<template>
  <v-card  max-height="40" min-width="150" outlined style="padding:10px;overflow: hidden;">  
    <v-checkbox id = "checkbox" dense class="ma-0 pa-0" v-model="checked" @change ="toggleTooltip()" label="Show Tooltips"/>
  </v-card>
</template>
<script>
export default {
  name: 'TooltipToggler',
  data: function() {
    return {
      checked : true
    }
  },
  methods: {
    toggleTooltip: function(){
      this.$store.commit('toggleTooltip')
    }
  }
}
</script>
<style scoped>
.label {
  margin-left :15px;
}
</style>