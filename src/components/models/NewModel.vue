<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template v-slot:activator="{ on }">
      <v-btn x-large block v-on="on" raised> Create/Add </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">New Model</span>
      </v-card-title>
      <v-card-text>
        <v-container>
            <v-col>
              <v-text-field dense class="ma-0 pa-0" :rules="rules" v-model="name" label="Name"/>
              <v-textarea outlined dense class="ma-0 pa-0" v-model="description" label="Description"/>
              <v-select dense class="ma-0 pa-0" v-model="type" :items="availableTypes()" label="Type"/>
            </v-col>
        </v-container>
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

export default {
  name: 'new-model',
  data: function () {
    return {name: '', description: '', type: '', dialog: false}
  },
  components: {
  },
  mounted () {
    const availableTypes = this.$store.state.availableModelTypes
    if( availableTypes.length > 0 ) {
      this.type = availableTypes[0]
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
  methods: {
    availableTypes: function () {
      return this.$store.state.availableModelTypes
    },
    isUnique (name) {
      const modelIndex = this.$store.state.models.findIndex(m => m.name === name)
      if (modelIndex === -1) {
        return true
      }
      return false
    },
    create: function () {
      this.$store.commit('addModel', {name: this.name, description: this.description, type: this.type})
      this.clear()
    },
    clear: function () {
      this.name = ''
      this.type = ''
    }
  }
}
</script>
