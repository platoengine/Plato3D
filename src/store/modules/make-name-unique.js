function makeNameUnique (name, uniqueID) {
  let uniqueName = name
  if (name.charAt(name.length - 1) !== ')') {
    uniqueName += ` (${uniqueID.newID()})`
  } else {
    let openParen = name.lastIndexOf('(')
    if (openParen === -1) {
      uniqueName += ` (${uniqueID.newID()})`
    } else {
      let sub = name.substring(openParen+1, name.length-1)
      let val = parseInt(sub, 10)
      if (isNaN(val)) {
        uniqueName += ` (${uniqueID.newID()})`
      } else {
        uniqueName = `${name.substring(0,openParen)} (${uniqueID.newID()})`
      }
    }
  }
  return uniqueName
}

export default makeNameUnique
