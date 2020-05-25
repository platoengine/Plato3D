function importFile (formData, dataType) {
  const models = formData.getAll('scenarios')
  const promises = models.map(x => getData(x, dataType)
    .then(model => ({
      fileName: x.name,
      fileType: x.name.split('.').pop(),
      data: model
    })))
  return Promise.all(promises)
}

function getData (file, dataType) {
  return new Promise((resolve) => {
    const fReader = new FileReader()

    fReader.onload = () => {
      resolve(fReader.result)
    }

    if (dataType === 'binary') {
      fReader.readAsArrayBuffer(file)
    } else {
      fReader.readAsText(file)
    }
  })
}

export { importFile }
