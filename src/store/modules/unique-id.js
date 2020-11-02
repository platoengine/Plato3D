class UniqueID {
  constructor () {
    this.dont_modify_this__ID = 0
  }

  get ID () {
    return this.dont_modify_this__ID
  }

  set ID (newData) {
    // dont' set the ID
  }

  newID () {
    this.dont_modify_this__ID += 1
    return this.dont_modify_this__ID
  }
  
}

export default UniqueID
