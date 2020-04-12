class ParBase {
  constructor () {
    this._name = ''
    this._type = ''
    this._description = ''
    this._definition = ''
    this._requires = []
    this._accepts = []
    this._provides = []
    this._state = []
    this._remote = {}

    this.parameters = []
  }

  get remote () {
    return this._remote
  }

  set remote (newData) {
    this._remote = newData
  }

  get name () {
    return this._name
  }
  set name (newValue) {
    this._name = newValue
  }

  get type () {
    return this._type
  }
  set type (newValue) {
    this._type = newValue
  }

  get description () {
    return this._description
  }
  set description (newValue) {
    this._description = newValue
  }

  get definition () {
    return this._definition
  }
  set definition (newValue) {
    this._definition = newValue
  }

  get requires () {
    return this._requires
  }
  set requires (newValue) {
    this._requires = newValue
  }

  get accepts () {
    return this._accepts
  }
  set accepts (newValue) {
    this._accepts = newValue
  }

  get provides () {
    return this._provides
  }
  set provides (newValue) {
    this._provides = newValue
  }

  get state () {
    return this._state
  }
  set state (newValue) {
    this._state = newValue
  }
}

export default ParBase
