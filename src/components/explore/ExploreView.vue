<template>
  <v-card>
    <e-radar-plot/>
  </v-card>
</template>

<script>

import ERadarPlot from './ERadarPlot'

export default {
  name: 'explore-view',
  components: {
    ERadarPlot,
  }
}
</script>
