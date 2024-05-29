const socket = new WebSocket("ws://localhost:8080")

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
  const { timeStamp } = receivedObject

  switch (receivedObject.type) {
    case "chatMessage":
      newMessage.textContent = `[${timeStamp}] ${username}: ${message}`
      break
    case "systemNotification":
      newMessage.textContent = `${message} at ${timeStamp}`
      break
    default:
      console.warn("Unknown message type:", receivedObject.type)
  }

  messageContainer.appendChild(newMessage)
}
