<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
      <v-btn small v-on="on">
        <v-icon>mdi-folder-upload</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Load Model</span>
      </v-card-title>
      <v-card-text>
        <load-model v-on:load-model='load($event)'/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false; clear()">Cancel</v-btn>
        <v-btn text @click="dialog = false; create()" :disabled="this.type===''">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LoadModel from './LoadModel'

  export default {
    name: 'import-model',
    data: function () {
      return {
        dialog: false
      }
    },
    components: {
      LoadModel
    },
    methods: {
      load(eventData) {
        this.dialog = false
        this.$emit('load-model', eventData)
      }
    }
  }
</script>
