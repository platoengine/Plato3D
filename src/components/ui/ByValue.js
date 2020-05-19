import Vue from 'vue'

export function staticCopy (obj, objCopy) {
  let keys = Object.keys(obj)
  keys.forEach(k => {
    if (Array.isArray(obj[k])) {
      objCopy[k] = []
      obj[k].forEach(a => {
        objCopy[k].push(a)
      })
    } else
    if (typeof obj[k] === 'object') {
      objCopy[k] = {}
      staticCopy(obj[k], objCopy[k])
    } else {
      objCopy[k] = obj[k]
    }
  })
}
export function dynamicCopy (obj, objCopy) {
  let keys = Object.keys(obj)
  keys.forEach(k => {
    if (Array.isArray(obj[k])) {
      Vue.set(objCopy, k, [])
      obj[k].forEach(a => {
        objCopy[k].push(a)
      })
    } else
    if (typeof obj[k] === 'object') {
      Vue.set(objCopy, k, {})
      dynamicCopy(obj[k], objCopy[k])
    } else {
      Vue.set(objCopy, k, obj[k])
    }
  })
}
