function parseConsole (resultsData) {
  console.log(resultsData)
  let lines = resultsData.split('\n')

  let tReading = false
  let tObjData = [{}]
  let tKeys = []
  let tIter = 0

  lines.forEach( (line) => {
    if (line.includes("     Output|")) {
      tReading = false
      tIter += 1
      tObjData.push({})
    }
    if (tReading === true) {
      line.split('|').forEach( (field, i) => { tObjData[tIter][tKeys[i]].push(field.trim()) })
    }
    if (line.includes("      Input|")) {
      tReading = true
      if (tKeys.length === 0) {
        line.split('|').forEach( (field) => { tKeys.push(field.trim()) })
      }
      tKeys.forEach( (key) => { tObjData[tIter][key] = [] })
    }
  })

  tObjData.pop()

  return tObjData
}

export default parseConsole
