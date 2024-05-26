import express from "express"
import path from "path"
import { createServer } from "http"
import WebSocket, { WebSocketServer } from "ws"

const port = 3000
const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server: server })

app.use(express.static(path.join(__dirname, "../public")))

wss.on("connection", function connection(ws) {
  ws.on("error", console.error)

  ws.send("Connected")

  ws.on("message", function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary })
      }
    })
  })
})

app.get("/", (req, res) => {
  res.send("Chat app")
})

server.listen(port, () => {
  console.log(`Running on port ${port}`)
})
