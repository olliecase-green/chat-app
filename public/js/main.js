const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
const socket = new WebSocket(`${protocol}//${window.location.host}`)

const sendBtn = document.getElementById("send-btn")
const message = document.getElementById("message-input")
const messageContainer = document.getElementById("message-container")

const url = window.location.href
const urlObj = new URL(url)
const params = new URLSearchParams(urlObj.searchParams)
const username = params.get("username")

sendBtn.addEventListener("click", () => {
  const messageInput = message.value

  const messageObject = {
    type: "chatMessage",
    data: {
      username: username,
      message: messageInput,
    },
    timeStamp: new Date().toLocaleTimeString("en-GB").slice(0, 5),
  }

  socket.send(JSON.stringify(messageObject))
  message.value = ""
})

socket.onmessage = (event) => {
  const newMessage = document.createElement("div")
  const receivedObject = JSON.parse(event.data)
  const { message, username } = receivedObject.data
  const { type, timeStamp } = receivedObject

  switch (type) {
    case "chatMessage":
      newMessage.textContent = `[${timeStamp}] ${username}: ${message}`
      break
    case "systemNotification":
      newMessage.textContent = `${message} at ${timeStamp}`
      break
    default:
      window.alert(`Unknown message type: ${type}. Check console for details.`)
  }

  messageContainer.appendChild(newMessage)
  scrollToBottom(messageContainer)
}

const scrollToBottom = (element) => {
  element.scrollTop = element.scrollHeight
}
