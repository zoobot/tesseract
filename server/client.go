package main

import (
  "fmt"
  "github.com/gorilla/mux"
  "github.com/gorilla/websocket"
  "log"
  "net/http"
  "time"
)

// client.go handles read/write of messages to the websocket channel.
// readPump: sends messages to channel.
// writePump: receives messages from channel.
// serveWS: upgrades http connection to websocket, starts read/write pumps.

const (
  writeWait  = 10 * time.Second
  pongWait   = 60 * time.Second
  pingPeriod = (pongWait * 9) / 10
  // This is for max size, check here if we have problems on large Docs!
  maxMessageSize = 1024 * 1024
)

// sets up Upgrade object with methods for taking a normal HTTP connection and upgrading it to a websocket connection
var upgrader = websocket.Upgrader{
  ReadBufferSize:  maxMessageSize,
  WriteBufferSize: maxMessageSize,
}

// sets up a struct for client connections

type client struct {
  //ws connection
  ws *websocket.Conn
  //buffered channel that receives data type bytes
  send chan []byte
}

// sends message struct (msg, room) from socket to the hub for broadcast.
func (s subscription) readPump() {
  c := s.client
  defer func() {
    h.unregister <- s
    c.ws.Close()
  }()
  c.ws.SetReadLimit(maxMessageSize)
  c.ws.SetReadDeadline(time.Now().Add(pongWait))
  c.ws.SetPongHandler(func(string) error { c.ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })
  for {
    _, msg, err := c.ws.ReadMessage()
    if err != nil {
      if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
        log.Printf("error: %v", err)
      }
      break
    }
    m := message{msg, s.channel}
    h.broadcast <- m
  }
}

// Sets deadline for write attempt, at 10secs gives up and throws error.
func (c *client) write(mt int, payload []byte) error {
  c.ws.SetWriteDeadline(time.Now().Add(writeWait))
  return c.ws.WriteMessage(mt, payload)
}

// receives messages from hub, writes to websocket.
func (s *subscription) writePump() {
  c := s.client
  ticker := time.NewTicker(pingPeriod)
  defer func() {
    ticker.Stop()
    c.ws.Close()
  }()

  for {
    select {
    case message, ok := <-c.send:
      // fmt.Println("Writepump: client has fired message", message)
      if !ok {
        c.write(websocket.CloseMessage, []byte{})
        return
      }
      if err := c.write(websocket.TextMessage, message); err != nil {
        return
      }
    case <-ticker.C:
      if err := c.write(websocket.PingMessage, []byte{}); err != nil {
        return
      }
    }
  }
}

// upgrades http connection, starts read/write pumps.
func serveWS(w http.ResponseWriter, r *http.Request) {
  ws, err := upgrader.Upgrade(w, r, nil)
  vars := mux.Vars(r)

  fmt.Println("New socket opened at channel:", vars["channel"])

  if err != nil {
    log.Println("you have failed in serving the WS master", err)
    return
  }

  c := &client{send: make(chan []byte, maxMessageSize), ws: ws}
  s := subscription{c, vars["channel"]}
  h.register <- s
  go s.writePump()
  //why is readPump not also a go subroutine?
  s.readPump()
}
