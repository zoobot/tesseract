package main

import (
  "fmt"
  "net/http"
  "log"
  "github.com/gorilla/mux"
)

// handles routing
func main() {
  fmt.Println("Go server, go! (8k)")

  // run the hub to start websockets
  go h.run()

  // gorilla router
  r := mux.NewRouter()

  // websocket endpoint
  r.HandleFunc("/ws/{channel}", serveWS)

  /* ======>API<====== */
  r.HandleFunc("/db", saveDoc).Methods("POST")
  r.HandleFunc("/db", retrieveDoc).Methods("GET")
  r.HandleFunc("/db", updateDoc).Methods("PUT")
  r.HandleFunc("/db", deleteDoc).Methods("DELETE")
  /* <======end API======> */

  // Serve static files (make sure index has /client at start, so paths match)
  s := http.StripPrefix("/client", http.FileServer(http.Dir("client")))
  r.PathPrefix("/client").Handler(s)

  // serve index.html to root, or any path we don't recognise.
  r.HandleFunc("/", serveIndex)
  r.NotFoundHandler = http.HandlerFunc(serveIndex)

  // start 'er up.
  log.Fatal(http.ListenAndServe(":8000", r))
}

func serveIndex(w http.ResponseWriter, r *http.Request) {
  http.ServeFile(w, r, "client/index.html")
}
