<template>
  <v-dialog v-model="dialog" persistent  max-width="550px">
    <v-card>
      <div class = "container">
        <div class = "alert">
          <v-icon style="font-size:100px;color:yellow;"> mdi-alert</v-icon>
        </div>
        <b>Import Error</b> : Oops! Seems like something went wrong with the file
      </div> 
      <br><br>
      <v-btn  block tile text @click="closeDialog()"><h3>OK</h3></v-btn>  
    </v-card>
  </v-dialog>  
</template>

<script>

export default {
  name : "ImportError",
  props : ['dialog'],
  methods : {
    closeDialog : function() {
      this.$emit('closeImportErrorDialog')
    }
  }
}
</script>

<style scoped>

.container {
  padding: 10% 10% 0% 10%;
  text-align: center;
  line-height: 12px;
}
.err {
 padding-left: 30%;
 text-align: left;
}
</style>
 