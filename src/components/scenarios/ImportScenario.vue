<template>
  <v-card>
    <form enctype="multipart/form-data" novalidate>
      <div>
      <div class="dropbox">
        <input ref="fileInput" type="file"
          :name="loadFieldName" :disabled="isSaving"
          @click="clearSelection()" @input="filesChange($event.target.name, $event.target.files);fileCount = $event.target.files.length"
          accept=".xml" class="input-file"/>
          <p> Drag scenario here to import. (click to browse) </p>
      </div>
      </div>
    </form>
    <ImportError @closeImportErrorDialog ="closeDialog()" :dialog = 'dialog'/>
  </v-card>
</template>

<script>
  import { importFile } from './file-import'
  import ImportError from './ImportError'
  const STATUS_INITIAL = 0
  const STATUS_SAVING = 1
  const STATUS_SUCCESS = 2
  const STATUS_FAILED = 3

  export default {
    name: 'import-scenario',
    components : {ImportError},
    props: {
      name: {
        type: String,
        required: true
      }
    },
    data: function () {
      return {
        loadError: null,
        currentStatus: null,
        loadFieldName: 'scenarios',
        visibleImport: false,
        dialog : false
      }
    },
    computed: {
      isSaving () {
        return this.currentStatus === STATUS_SAVING
      }
    },
    methods: {
      reset () {
        this.currentStatus = STATUS_INITIAL
        this.loadError = null
      },
      closeDialog() {
        this.dialog = false
      },
      save (formData) {
        this.currentStatus = STATUS_SAVING

        importFile(formData)
          .then(x => {
            this.currentStatus = STATUS_SUCCESS
            this.$store.commit('loadScenario',
              {
                name: this.name,
                data: x[0].data,
                type: 'xml'
              })
          })
          .catch(err => {
            this.loadError = err.response
            this.currentStatus = STATUS_FAILED
            this.dialog = true
          })
        this.currentStatus = STATUS_SUCCESS
        this.visibleImport = false
        this.$emit('close-panel')
      },
      clearSelection () {
        this.$refs.fileInput.value = ''
      },
      filesChange (fieldName, fileList) {
        const formData = new FormData()

        if (!fileList.length) return

        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(fieldName, fileList[x], fileList[x].name)
          })

        this.save(formData)
      }
    },
    mounted () {
      this.reset()
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
