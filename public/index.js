const socket = new WebSocket("ws://localhost:3000")

const sendBtn = document.getElementById("send-btn")
const message = document.getElementById("message-input")
const handle = document.getElementById("handle")
const messageContainer = document.getElementById("message-container")

sendBtn.addEventListener("click", () => {
  const messageInput = message.value
  const handleName = handle.value
  const data = { messageInput, handleName }
  socket.send(JSON.stringify(data))
  message.value = ""
})

socket.addEventListener("message", (event) => {
  const newMessage = document.createElement("div")
  try {
    const data = JSON.parse(event.data)
    newMessage.textContent = `${data.handleName}: ${data.messageInput}`
  } catch {
    newMessage.textContent = event.data
  } finally {
    messageContainer.appendChild(newMessage)
  }
})
