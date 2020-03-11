/**
 * Creates notifications to client.
 *
 * @author Findlay Forsblom, ff222ey, Linnaeus University.
 */

const newToast = document.createElement('template')
newToast.innerHTML = `
<!-- Then put toasts within -->
<div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="false">
    <div class="toast-header">
        <strong class="mr-auto head-text">New motion detected</strong>
        <small class="text-muted">just now</small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" >
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
        <div class="toast-body">
            <p>Motion detected from <span class="italics dev-name">LoraDeviceName</span></p>
            <p>Image taken from raspbery pi <span class="italics time">2:55 pm today</span></p>
            <img class="img" src="https://scontent.fbma4-1.fna.fbcdn.net/v/t1.0-9/10940480_1375253096119993_7246019023456750357_n.jpg?_nc_cat=101&_nc_ohc=sQlQyiDJGsYAX_FDhIE&_nc_ht=scontent.fbma4-1.fna&oh=5904c5b85b1ec2fcb88098fce9b05f72&oe=5F01FAEC">
        </div>
</div>
`

export default class Notify {
/**
 * Creates a new notifcation
 * @param {string} title - Title of the notification
 * @param {string} message - The body of the notifcation
 * @param {string} img - url of the image taken
 * @param {string} deviceID - The device id where the notification originated
 * @param {date} time - The time it occured
 * @param {string} url - Url used by the notifcation Api to redirect back to the site
 */

  constructor (title, message, img, deviceID, time, url) {
    this.title = title
    this.message = message
    this.img = img
    this.deviceID = deviceID
    this.time = time
    this.url = url
  }

  notify () {
    notifyClient.call(this)
    if (document.hidden) {
      notificationApi.call(this)
    }
  }
}

/** Private methods of the Notify class */

/**
 * Notifies the clientt when the document is in view
 */
function notifyClient () {
  const notis = document.querySelector('.notis')
  const toast = newToast.content.cloneNode(true).firstElementChild
  const header = toast.querySelector('.head-text')
  const devName = toast.querySelector('.dev-name')
  const time = toast.querySelector('.time')
  const img = toast.querySelector('.img')

  header.innerText = this.message
  devName.innerText = this.deviceID
  this.body = header.textContent + ' from ' + devName.textContent
  time.innerText = this.time
  if (this.img) {
    // If image exists, otherwise show default img.
    img.src = this.img
  }

  notis.appendChild(toast, notis.firstElementChild)
  window.$(toast).toast('show')
}

function notificationApi () {
  if ('Notification' in window) {
    if (window.Notification.permission === 'granted') {
      // If it's okay let's create a notification
      doNotify.call(this)
    } else {
      // notification == denied
      window.Notification.requestPermission()
        .then(function (result) {
          console.log(result) // granted || denied
          if (window.Notification.permission === 'granted') {
            doNotify.call(this)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}

/**
 * Uses the notification API to notfiy the client
 * when the document is hidden
 */

function doNotify () {
  const title = this.title
  const t = Date.now() + 120000 // 2 mins in future
  const options = {
    body: this.body,
    lang: 'en-CA',
    icon: this.img,
    timestamp: t,
    vibrate: [100, 200, 100]
  }
  const n = new window.Notification(title, options)
  n.addEventListener('click', function (ev) {
    console.log('clicked')
    window.focus()
    window.open(this.url, '_self')
    n.close()
  })
  setTimeout(n.close.bind(n), 10000) // close notification after 10 seconds
}
