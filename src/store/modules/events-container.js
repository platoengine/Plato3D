import ErrorHandler from './error-handler-module'
const errorHandler = new ErrorHandler()

function EventsContainer () {
  this.eventSource = null
  this.eventNames = []
  this.pendingListeners = []

  this.setSource = function (server) {
    this.eventSource = new EventSource(`${server}/stream`)
    this.eventSource.onmessage = function (event) {
      errorHandler.report(`message from EventSource: ${event.data}`)
    }
    while (this.pendingListeners.length) {
      const {myName, myFunction} = this.pendingListeners.pop()
      this.addListener(myName, myFunction)
    }
  }

  this.addListener = function (aName, aFunction) {
    if (this.eventSource === null) {
      this.pendingListeners.push({myName: aName, myFunction: aFunction})
    } else {
      if (this.eventNames.includes(aName) === false) {
        this.eventNames.push(aName)
        this.eventSource.addEventListener(aName, aFunction)
      }
    }
  }
}

export default EventsContainer
