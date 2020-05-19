<template>
  <v-card>
    <div v-for="(prop, index) in propertyNames" :key="index">
      <div v-if="conditionalView(prop)">
        <display-sub :data="getPropertyValue(prop)" :name="prop" v-on:pending="setPending()"/>
      </div>
    </div>
  </v-card>
</template>

<script>

export default {
  name: 'display-branch',
  props: {
    data: Object,
    name: {
      type: String,
      required: false,
      default: ''
    }
  },
  components: {
    DisplaySub: () => import('./DisplaySub')
  },
  computed: {
    propertyNames: function () {
      let names = Object.keys(this.data).filter(e => e !== 'conditionalView')
      return names
    }
  },
  methods: {
    setPending: function () {
      this.$emit('pending')
    },
    conditionalView: function (param) {
      if (Object.prototype.hasOwnProperty.call(this.data[param], 'conditionalView')) {
        let condition = this.data[param]['conditionalView']
        if (Array.isArray(condition)) {
          if (Object.prototype.hasOwnProperty.call(this.data, condition[0])) {
            return this.data[condition[0]].value === condition[1]
          }
        }
      }
      return true
    },
    getPropertyValue: function (param) {
      return this.data[param]
    }
  }
}
</script>
