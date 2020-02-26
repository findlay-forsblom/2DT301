import Notify from './notify.js'

/**
 * Main client module
 */

window.$('.toast').toast('show')
const socket = window.io()
let streamSrc = ''
let streamId = ''
let img
let img2
let p1

/**
 * Listens for notification events from the server
 */
socket.on('notification', (data) => {
  console.log('Notification received.')
  img = data.imgUrl
  const title = 'Motion detected'
  const url = window.location.href
  const message = data.message
  const deviceID = data.deviceID
  const time = data.time
  const notis = new Notify(title, message, img, deviceID, time, url)
  notis.notify()
  window.$('.toast-body').click(click)
})

socket.on('streamurl', (data) => {
  streamId = '?id=' + data.id
  streamSrc = data.src
  console.log('Stream id received.', streamId, streamSrc)
})

/**
 * Function for the click event of the toast-body classes
 * @param {eventObjecct} e -The event object
 */

function click (e) {
  lightbox.innerHTML = ''
  const img = document.createElement('img')
  const div = document.createElement('div')
  const p = document.createElement('p')
  p.textContent = 'Click to start stream'
  p.classList.add('playText')
  div.appendChild(img)
  div.appendChild(p)
  let selectedImage = e.currentTarget
  selectedImage = selectedImage.querySelector('img')
  const url = selectedImage.getAttribute('src')
  img.setAttribute('src', url)
  lightbox.appendChild(div)
  lightbox.classList.remove('hide')
  img2 = img
  p1 = p
}

// If stream button pressed, start stream.
const streamBtn = document.querySelector('.streamBtn')
const streamTag = document.querySelector('.player img')
const noStreamTag = document.querySelector('.player p')
const lightbox = document.createElement('div')
lightbox.classList.add('hide')
lightbox.id = 'lightbox'
document.body.appendChild(lightbox)

lightbox.addEventListener('click', (e) => {
  if (e.target === img2 || e.target === p1) {
    img2.setAttribute('src', `${streamSrc}/stream${streamId}`)
    p1.classList.add('hide')
  } else {
    lightbox.classList.toggle('hide')
  }
})

/**
 * gets the image url from the recents events and displays the
 * image in form of a lightbox when clicked
 */

window.$('.imagesurl').click(function (e) {
  const url = e.currentTarget.getAttribute('data-url')
  lightbox.innerHTML = ''
  lightbox.classList.toggle('hide')
  const img = document.createElement('img')
  img.setAttribute('src', url)
  img.classList.add('.img4')
  lightbox.appendChild(img)
})

/**
 * The function responsible for starting and stopping videoStreams
 */

streamBtn.addEventListener('click', () => {
  if (streamBtn.innerText === 'Request Video Stream') {
    streamTag.src = `${streamSrc}/stream${streamId}`
    streamTag.classList.replace('hide', 'show')
    noStreamTag.classList.replace('show', 'hide')
    streamBtn.innerText = 'Stop stream'
    streamBtn.classList.replace('btn-primary', 'btn-danger')
  } else {
    streamTag.classList.replace('show', 'hide')
    noStreamTag.classList.replace('hide', 'show')
    streamBtn.innerText = 'Request Video Stream'
    streamBtn.classList.replace('btn-danger', 'btn-primary')
  }
})
