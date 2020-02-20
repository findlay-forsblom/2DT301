import Notify from './notify.js'

window.$('.toast').toast('show')
const socket = window.io()
const STREAM_SRC = 'http://85.228.224.34:8081'
let img

socket.on('notification', (data) => {
  console.log('Got notification')
  img = data.imgUrl
  const title = 'Motion detected'
  const url = window.location.href
  const message = data.message
  const deviceID = data.deviceID
  const time = data.time
  const notis = new Notify(title, message, img, deviceID, time, url)
  notis.notify()
})

// If stream button pressed, start stream.
const streamBtn = document.querySelector('.streamBtn')
const streamTag = document.querySelector('.player img')
const noStreamTag = document.querySelector('.player p')

streamBtn.addEventListener('click', () => {
  streamTag.src = `${STREAM_SRC}/stream`
  streamTag.classList.replace('hide', 'show')
  noStreamTag.classList.replace('show', 'hide')
})
