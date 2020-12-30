<template>
  <v-menu :eager=true :close-on-content-click="false" transition="slide-x-transition" bottom left offset-y>
    <template v-slot:activator="{ on }">
      <v-btn large icon v-on="on">
        <slot name="button"></slot>
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
