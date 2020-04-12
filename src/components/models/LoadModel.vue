<template>
  <v-card no-body>
    <form enctype="multipart/form-data" novalidate>
      <div class="dropbox">
        <input enctype="multipart/form-data" ref="fileInput" type="file"
          name="file"
          @click="clearSelection()"
          @change="filesChange()"
          class="input-file"/>
          <p> Drag model here to import. (click to browse) </p>
      </div>
    </form>
  </v-card>
</template>

<script>
  export default {
    name: 'load-model',
    methods: {
      clearSelection () {
        this.$refs.fileInput.value = ''
      },
      filesChange () {
        const file = this.$refs.fileInput.files[0]
        const fileName = this.$refs.fileInput.value.split('\\').pop()
        const formData = new FormData()
        formData.append('file', file)
        formData.append('name', fileName)
        this.$emit('load-model', formData)
      }
    }
  }
</script>

<style scoped>
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 80px; /* minimum height */
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 80px;
    position: absolute;
    top: 0px;
    right: 0px;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightgray; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 0.8em;
    text-align: center;
    padding: 5px 0;
    margin: 5px 0;
  }
</style>
