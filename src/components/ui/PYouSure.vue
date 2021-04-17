<template>
  <v-dialog v-model="dialogState" persistent max-width="400px">
    <v-card>
      <v-card-title>Delete Entry?</v-card-title>
      <v-card-text>{{ query }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel()">Cancel</v-btn>
        <v-btn text @click="confirm()">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'p-you-sure',
  props: ['dialog', 'query'],
  data: function () {
    return {
      newEntryName: '',
      dataState: {},
      savePending: false,
     
    }
  },
  computed: {
    dialogState: {
      get: function () {
        return this.dialog
      },
      set: function (val) {
        this.$emit('set-dialog', val)
      }
    }
  },
  methods: {
    cancel: function () {
      this.$emit('cancel')
      this.dialogState = false
    },
    confirm: function () {
      this.$emit('confirm')
      this.dialogState = false
    }
  }
}
</script>
