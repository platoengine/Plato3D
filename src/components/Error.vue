<template>
  <div class = "container">
    <div class = "alert">
      <v-icon style="font-size:100px;color:yellow;"> mdi-alert</v-icon>
    </div>
    <br><br>
    <h2>Oops, this scenario will fail to run with Analyze!</h2><br><br>
    <div class= "err" v-bind:key= "error" v-for="error in errors">
      <h3>{{error}}</h3>
      <br>
    </div>
  </div>  
</template>
<script>
export default {
  name : "Error",
  props: {
    errors : Array
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
 