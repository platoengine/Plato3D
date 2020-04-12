<template>
  <v-menu :close-on-content-click="false" transition="slide-x-transition" bottom left offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <slot name="button"><v-icon>mdi-lightbulb-outline</v-icon></slot>
      </v-btn>
    </template>
    <slot></slot>
  </v-menu>
</template>

<script>
export default {
    name: 'PMenu',
    data: () => ({
    })
};
</script>
