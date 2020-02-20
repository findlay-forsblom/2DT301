$('.toast').toast('show')

const socket = window.io()

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
            <p>Image taken from raspbery pi at <span class="italics">2:55 pm today</span></p>
            <img class="img" src="https://scontent.fbma4-1.fna.fbcdn.net/v/t1.0-9/10940480_1375253096119993_7246019023456750357_n.jpg?_nc_cat=101&_nc_ohc=sQlQyiDJGsYAX_FDhIE&_nc_ht=scontent.fbma4-1.fna&oh=5904c5b85b1ec2fcb88098fce9b05f72&oe=5F01FAEC">
        </div>
</div>
`
socket.on('notification', (data) => {
  console.log('Got notification')
  const notis = document.querySelector('.notis')
  const toast = newToast.content.cloneNode(true).firstElementChild
  const header = toast.querySelector('.head-text')
  const devName = toast.querySelector('.dev-name')

  header.innerText = data.message
  devName.innerText = data.deviceID

  notis.insertBefore(toast, notis.firstElementChild)
})
