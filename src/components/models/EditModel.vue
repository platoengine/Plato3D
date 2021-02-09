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
        <v-form @submit.prevent ref="form" v-model="valid" lazy-validation>
        <v-container>
            <v-col>
              <v-text-field autocomplete="off" dense class="ma-0 pa-0" :rules="rules" @change="pending=true" v-model="state.name" label="Name"/>
              <v-textarea outlined dense class="ma-0 pa-0" @input="pending=true" v-model="state.description" label="Description"/>
            </v-col>
        </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false;">Cancel</v-btn>
        <v-btn text @click="dialog = false; update()" :disabled="pending==false || valid==false">Update</v-btn>
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
      dialog: false,
      pending: false,
      valid: true
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
      } else {
        if (name == this.model.name) {
          return true
        } else {
          return false
        }
      }
    },
    validate () {
      this.$refs.form.validate()
    },
    update: function () {
      this.validate()
      if( this.valid ) {
        this.dialog = false
        this.pending = false
        this.$store.commit('setModelAttributes', {
          currentName: this.model.name,
          modelAttributes: {
            name: this.state.name,
            description: this.state.description
          }})
        this.state.name = this.model.name
        this.state.description = this.model.description
      } 
    }
  }
}
</script>
