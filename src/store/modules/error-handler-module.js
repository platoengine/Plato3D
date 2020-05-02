function ErrorHandler () {
  this.report = function (errorString) {
    let tTextArea = document.getElementById('error-console')
    if (tTextArea) {
      tTextArea.innerHTML += errorString + '\n'
      tTextArea.scrollTop = tTextArea.scrollHeight
    }
  }
  this.reportAndThrow = function (errorString) {
    this.report(errorString)
    throw errorString
  }
}

export default ErrorHandler
