import express from "express"
import path from "path"
import { createServer } from "http"
import WebSocket, { WebSocketServer } from "ws"

const port = 8080
const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

interface sendItem {
  type: "systemNotification" | "chatMessage"
  data: {
    [key: string]: string
  }
  timeStamp: number
}

app.use(express.static(path.join(__dirname, "../public")))

wss.on("connection", function connection(ws) {
  ws.on("error", console.error)

  const messageObject: sendItem = {
    type: "systemNotification",
    data: {
      message: "Connected",
    },
    timeStamp: new Date().getTime(),
  }

  ws.send(JSON.stringify(messageObject))

  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary })
      }
    })
  })
})

server.listen(port, () => {
  console.log(`Running on port ${port}`)
})
