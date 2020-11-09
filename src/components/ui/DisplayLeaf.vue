<template>
  <v-tooltip :disabled="toolTipDisabled" top >
    <template v-slot:activator="{ on, attrs }">
      <div v-if="hasOptions()" v-bind="attrs" v-on="on" >
        <v-select  :label=name :disabled="fixed" dense class="ml-2 ma-0 pa-0" v-on:change="setPending()" v-model="parameterValue" :items="getOptions()"/>
      </div>
      <div v-else>
        <div v-if="isObject()" >
          <array-input v-for="(entry, index) in Object.keys(data)" @pending="setPending()"
            @set-value="setData(entry,$event)" :key="index" :data="data[entry]" :name="entry"/>
        </div>
        <div v-else>
          <v-text-field v-bind="attrs" v-on="on" :label=name :disabled="fixed" dense class="ml-2 ma-0 pa-0 body-2" v-on:input="setPending()" v-model="parameterValue">
          </v-text-field>
        </div>
      </div>
    </template>
    <span>{{tooltip}}</span>
  </v-tooltip>  
</template>

<script>
import ArrayInput from './ArrayInput'

export default {
  name: 'display-leaf',
  components: {
    ArrayInput
  },
  props: {
    data: [String, Object],
    name: String,
    options: {
      type: [Array, Function],
      required: false,
      default: () => { return [] }
    },
    fixed: {
      type: Boolean,
      required: false,
      default: false
    }, 
    tooltip:String
  },

  computed: {
    toolTipDisabled:function() {
      if(this.tooltip === ""){ return true}
      return false
    },
    parameterValue: {
      set: function (param) {
        this.$emit('set-value', param)
      },
      get: function () {
        return this.data
      }
    }
  },
  methods: {
    setData: function (entry, value) {
      let newValue = {}
      Object.keys(this.data).forEach(k => { newValue[k] = this.data[k] }, this)
      newValue[entry] = value
      this.parameterValue = newValue
      
    },
    isObject: function () {
      let value = this.data
      return (value && typeof value === 'object' && !Array.isArray(value))
    },
    hasOptions: function () {
      if (typeof this.options === 'function') {
        return true
      } else {
        return this.options.length > 0
      }
    },
    getOptions: function () {
      if (typeof this.options === 'function') {
        return this.options()
      } else {
        return this.options
      }
    },
    setPending: function () {
      this.$emit('pending')
    }
  }
}
</script>