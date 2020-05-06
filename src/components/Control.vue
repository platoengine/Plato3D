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
          <v-card flat>
            <v-card-text>
              <p>
                Yo shit 2
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab class="px-0 mx-0">
          <v-icon dense left>mdi-pencil-outline</v-icon>
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                Yo shit 3
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab class="px-0 mx-0">
          <v-icon dense left>mdi-code-braces</v-icon>
        </v-tab>
        <v-tab-item>
          <v-container class="pa-0 ma-0">
          <v-row no-gutters>
          <v-col>
              <p> Yo shit 4 </p>
              <p> Yo shit 4 </p>
              <p> Yo shit 4 </p>
              <p> Yo shit 4 </p>
              <p> Yo shit 4 </p>
              <p> Yo shit 4 </p>
              <p> Yo shit 4 </p>
              <p> Yo shit 4 </p>
              <p> Yo shit 4 </p>
              <p> Yo shit 4 </p>
              <p> Yo shit 4 </p>
          </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <v-row>
            <p>dufuq</p>
          </v-row>
          </v-container>
        </v-tab-item>
      <v-spacer></v-spacer>
      </v-tabs>
</template>

<script>
import ModelTree from './models/ModelTree'

export default {
    name: 'Control',
    components: {
      ModelTree
    },
    data: () => ({
    })
};
</script>
