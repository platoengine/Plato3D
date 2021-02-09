<template>
  <div>
    <div v-if="isBranch(this.data)">
      <v-expansion-panels accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span :style="this.getBranchColor">{{this.name}}</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card class="ma-0 pa-0" color=green>
              <v-card class="ml-2 pt-3">
                <display-branch :data="this.data" :name="dataName" v-on:pending="setPending()"/>
                <v-btn v-if="this.modify_button" small block @click="save()" :disabled="!savePending" type="button">
                  Modify
                </v-btn>
              </v-card>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-else-if="isLeaf(this.data)">
      <display-leaf :tooltip="toolTipText" :data="dataValue" :name="dataName" :options="dataOptions" :fixed="dataFixed"
        v-on:set-value="dataValue=$event" v-on:pending="setPending()"/>
    </div>
    <div v-else>
      error loading view.  Input is neither a leaf nor a branch.
    </div>
  </div>
</template>

<script>
import DisplayBranch from './DisplayBranch'
import DisplayLeaf from './DisplayLeaf'
import {allFieldsSpecified} from './FieldChecker'

export default {
  name: 'display-sub',
  props: {
    myKey: String,
    parentObject: Object,
    data: Object,
    name: String,
    modify_button: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    DisplayBranch,
    DisplayLeaf
  },
  data: function () {
    return {
      savePending: false
    }
  },
  computed: {
    getBranchColor: function () {
      return allFieldsSpecified(this.parentObject, this.myKey, true) === true ? {color: 'green'} : {color: 'red'}
    },
    toolTipText:function(){
      if(this.data['tooltip']){
        return this.data['tooltip']
      } 
      return ''
    },
    dataValue: {
      get: function () {
        let val = this.data['value']
        return val
      },
      set: function (newVal) {
        if (typeof newVal === 'object' && !Array.isArray(newVal)) {
          let thisData = this.data['value']
          Object.keys(newVal).forEach(k => {
            if (Object.prototype.hasOwnProperty.call(thisData, k)) {
              this.$set(this.data['value'], k, newVal[k])
            }
          })
        } else {
          this.$set(this.data, 'value', newVal)
        }
      }
    },
    dataName: function () {
      let name = this.name
      return name
    },
    dataFixed: {
      get: function () {
        if (Object.prototype.hasOwnProperty.call(this.data, 'fixed')) {
          return this.data['fixed']
        }
        return false
      },
      set: function () {
      }
    },
    dataOptions: {
      set: function () {
      },
      get: function () {
        if (this.hasOptions()) {
          return this.data['options']
        } else {
          return []
        }
      }
    }
  },
  methods: {
    save: function () {
      this.$emit('save')
      this.savePending = false
    },
    setPending: function () {
      this.$emit('pending')
      this.savePending = true
    },
    hasOptions: function () {
      return Object.prototype.hasOwnProperty.call(this.data, 'options')
    },
    hasPropertyOfType (aVar, aName, aType) {
      if (Object.prototype.hasOwnProperty.call(aVar, aName)) {
        if (typeof aVar[aName] === aType) {
          return true
        }
      }
      return false
    },
    isParameter (aVar) {
      return this.hasPropertyOfType(aVar, 'type', 'string') &&
        (this.hasPropertyOfType(aVar, 'value', 'string') ||
        this.hasPropertyOfType(aVar, 'value', 'object'))
    },
    isBranch: function (data) {
      let isParam = this.isParameter(data)
      if (isParam === false) {
        if (typeof data === 'object' && !Array.isArray(data)) {
          return true
        }
      }
      return false
    },
    isLeaf: function (data) {
      let isParam = this.isParameter(data)
      return isParam
    }
  }
}
</script>
