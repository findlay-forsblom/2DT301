import Notify from './notify.js'

window.$('.toast').toast('show')
const socket = window.io()
let img

socket.on('notification', (data) => {
  console.log('Got notification')
  img = 'https://scontent.fbma4-1.fna.fbcdn.net/v/t1.0-9/10940480_1375253096119993_7246019023456750357_n.jpg?_nc_cat=101&_nc_ohc=sQlQyiDJGsYAX_FDhIE&_nc_ht=scontent.fbma4-1.fna&oh=5904c5b85b1ec2fcb88098fce9b05f72&oe=5F01FAEC'
  const title = 'Motion detected'
  const url = window.location.href
  const message = data.message
  const deviceID = data.deviceID
  const time = data.time
  const notis = new Notify(title, message, img, deviceID, time, url)
  notis.notify()
})
