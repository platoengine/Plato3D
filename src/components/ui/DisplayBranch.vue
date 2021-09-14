<template>
  <v-card>
    <div v-for="(prop, index) in propertyNames" :key="index">
      <div v-if="displayable(prop)">
        <display-sub :modify_button="modify_button" :remove_button="remove_button"
          :myKey="prop" :parentObject="data" :data="getPropertyValue(prop)" :name="getPropertyName(prop)"
          v-on:pending="setPending()" v-on:save="save()" v-on:remove="remove()"/>
      </div>
    </div>
  </v-card>
</template>

<script>

export default {
  name: 'display-branch',
  props: {
    data: Object,
    modify_button: { type: Boolean, required: false, default: false },
    remove_button: { type: Boolean, required: false, default: false },
    name: { type: String, required: false, default: '' }
  },
  components: {
    DisplaySub: () => import('./DisplaySub')
  },
  computed: {
    propertyNames: function () {
      let names = Object.keys(this.data).filter(e => (e !== 'conditionalView') && (e !== 'conditionalValue'))
      return names
    }
  },
  methods: {
    save: function () {
      this.$emit('save')
    },
    remove: function () {
      this.$emit('remove')
    },
    setPending: function () {
      this.$emit('pending')
    },
    displayable: function (param) {
      if (typeof this.data[param] !== 'object') {
        return false
      }
      if (Object.prototype.hasOwnProperty.call(this.data[param], 'conditionalView')) {
        let conditions = this.data[param]['conditionalView']
        let satisfied = true
        conditions.forEach( condition => {
          if (Array.isArray(condition)) {
            if (Object.prototype.hasOwnProperty.call(this.data, condition[0])) {
              if (Array.isArray(condition[1])) {
                satisfied = satisfied && condition[1].includes(this.data[condition[0]].value)
              } else {
                satisfied = satisfied && this.data[condition[0]].value === condition[1]
              }
            }
          }
        })
        return satisfied
      }
      return true
    },
    getPropertyName: function (param) {
      return param.split('|')[0]
    },
    getPropertyValue: function (param) {
      return this.data[param]
    }
  }
}
</script>
