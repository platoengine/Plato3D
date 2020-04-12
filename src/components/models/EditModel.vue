<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small v-on="on">
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Edit Model</span>
      </v-card-title>
      <v-card-text>
        <v-container>
            <v-col>
              <v-text-field dense class="ma-0 pa-0" :rules="rules" @change="pending=true" v-model="state.name" label="Name"/>
              <v-textarea outlined dense class="ma-0 pa-0" @input="pending=true" v-model="state.description" label="Description"/>
            </v-col>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false;">Cancel</v-btn>
        <v-btn text @click="dialog = false; update()" :disabled="this.type===''">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'new-model',
  props: ['model'],
  data: function () {
    return {
      state: {
        name: '', description: ''
      },
      dialog: false
    }
  },
  computed: {
    rules () {
      const rules = []
      const rule = v => (this.isUnique(v)) || 'Model already exists'
      rules.push(rule)
      return rules
    }
  },
  created: function () {
    this.state.name = this.model.name
    this.state.description = this.model.description
  },
  methods: {
    isUnique (name) {
      const modelIndex = this.$store.state.models.findIndex(m => m.name === name)
      if (modelIndex === -1) {
        return true
      }
      return false
    },
    update: function () {
      this.dialog = false
      this.pending = false
      this.$store.commit('setModelAttributes',
        {
          currentName: this.model.name,
          modelName: this.state.name,
          modelDesc: this.state.description
        })
      this.state.name = this.model.name
      this.state.description = this.model.description
    }
  }
}
</script>
