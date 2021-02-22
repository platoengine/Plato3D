<template>
  <v-dialog v-model="dialog" width="500px" persistent>
    <template v-slot:activator="{ on }">
      <v-btn block v-on="on" raised @click ="goToHelpMenu()">
        Help
      </v-btn>
    </template>
    <v-card>
      <div class="help">
        <v-card-title class="headline dark">
          <v-icon color="yellow">mdi-help-circle-outline</v-icon>
        </v-card-title>
      </div>
      <div v-if="!showDesc" class="container">
        <table>
          <tr>
            <td>
              <v-btn block x-large  @click="setDesc('models')"><v-icon>mdi-shape-outline</v-icon>Models</v-btn>
            </td>
            <td>    
              <v-btn block x-large @click="setDesc('scenario')"><v-icon>mdi-wrench-outline</v-icon> Scenario</v-btn>
            </td>
          </tr>
          <tr>
            <td>
              <v-btn block x-large @click="setDesc('realization')"><v-icon>mdi-pencil-outline</v-icon>Realization</v-btn>
            </td>
            <td>
             <v-btn block x-large @click="setDesc('optimization')"><v-icon>mdi-code-braces</v-icon>Optimization</v-btn>
            </td>
          </tr>
        </table><br>       
        <v-divider></v-divider>
        <v-btn block @click="dialog=false"> Close </v-btn>
      </div>
      <div v-if="showDesc" class= "description">
        <div v-if="this.desc.models">
          Models
          <br><br>
          { ...Models Description...}
          <br><br>
        </div>
        <div v-if="desc.scenario">
          Scenario
          <br><br>
          { ...Scenario Description...}
          <br><br>
        </div>
        <div v-if="desc.realization">
          Realization
          <br><br>
          { ...Realization Description...}
          <br><br>
        </div>
        <div v-if="desc.optimization">
          Optimization
          <br><br>
          { ...Optimization Description...}
          <br><br>
        </div>
        <table>
          <tr>
            <td class ="action">
              <v-btn block @click = "goToHelpMenu()"> Back</v-btn>
            </td >
            <td class="action">
              <v-btn block @click = "dialog=false"> Close </v-btn>
            </td >
          </tr>
        </table>
      </div> 
    </v-card>
  </v-dialog> 
</template>
<script>
export default {
  name : "Help",
  data : function () {
    return {
      dialog: false,
      showDesc: false,
      desc : {
        models: false,
        scenario: false,
        realization: false,
        optimization: false
      }
    }
  },
  methods: {
    setDesc: function(option){
      this.showDesc =  true;
      for(let key in this.desc){
        if(key === option){   
          this.desc[key] = true;
        } else {
          this.desc[key] = false;
        }
      }
    }
   ,
   goToHelpMenu: function(){
    this.showDesc = false;
   }
  }    
 }

</script>

<style>
.v-dialog{
overflow-y: unset !important;
}
.description{
  text-align: center;
}
.container{
  text-align:center;
}
td {
  padding: 5px;
}
.action{
  padding:0px;
}
table{
  width:100%;
}
.help{
  text-align:center;
  left:43%;
  position:relative;
  
}

</style>
 