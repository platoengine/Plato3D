<template>
  <div>
    <div v-if="isBranch(this.data)">
      <display-branch :data="this.data" :name="dataName" v-on:pending="setPending()"/>
    </div>
    <div v-else-if="isLeaf(this.data)">
      <display-leaf :data="dataValue" :name="dataName" :options="dataOptions" :fixed="dataFixed"
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

export default {
  name: 'display-sub',
  props: ['data', 'name'],
  components: {
    DisplayBranch,
    DisplayLeaf
  },
  computed: {
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
    setPending: function () {
      this.$emit('pending')
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
