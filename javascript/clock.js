function time() {
  return Date()
}
function clock() {
  var date = time()
  document.getElementById('clock').innerHTML = date
}
function startClock() {
  while true {
    clock()
  }
}
