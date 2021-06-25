<template>
  <v-dialog v-model="dialogState" persistent max-width="400px" scrollable>
    <v-card outlined class="ma-2 pa-2">
    <v-card class="ma-2 pa-2">
      <v-card-title>System Messages</v-card-title>
      <v-card-text style="height:100px">
        <v-card outlined>
        <v-card class="h6" outlined v-for="(item, index) in dialogContent" :key="index">
           {{ item }}
        </v-card>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="clear()">Clear</v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="ma-2 pa-2">
      <v-card-title>Console Messages</v-card-title>
      <v-textarea outlined class="p-popout-console" style="padding:12px;"
         :no-resize=true :reverse=true :readonly=true :value="consoleContent()" disabled/>
    </v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'p-important-info',
  computed: {
    dialogState: {
      get: function () {
        return this.$store.state.systemInfoModal.State
      },
      set: function (val) {
        this.$store.commit('setSystemInfoModalState', val)
      }
    },
    dialogContent: function () {
      let content = this.$store.state.systemInfoModal.Content
      if (content.length === 0) {
        return ['None']
      } else {
        return content
      }
    }
  },
  methods: {
    clear: function () {
      this.$store.commit('clearSystemInfoModalContent')
    },
    close: function () {
      this.$store.commit('setSystemInfoModalState', false)
    },
    consoleContent: function () {
      let tTextArea = document.getElementById('error-console')
      if (tTextArea) {
        tTextArea.scrollTop = tTextArea.scrollHeight
        return tTextArea.innerHTML
      } else {
        return ""
      }
    }
  }
}
</script>

<style scoped>
.p-popout-console {
    font-size: 1.0em;
    padding: 2px;
}
</style>

