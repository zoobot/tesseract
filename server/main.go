package main

import (
  "fmt"
  "github.com/gorilla/mux"
  "log"
  "net/http"
  // "net/http/httputil"
  // "net/url"
)

const (
  PORTSSL    = ":8443"
  PORTREG    = ":8000"
  PUBLIC_KEY = "./cert.pem"
  PRIV_KEY   = "./key.pem"
)

// func redirectToHttps(w http.ResponseWriter, r *http.Request) {
//   // Redirect to https localhost:8443 will only work locally
//   http.Redirect(w,r, "https://localhost:"+PORTSSL+r.RequestURI, http.StatusMovedPermanently)
//

// func hander(w http.ResponseWriter, r *http.Request) {
//   fmt.Fprintf(w, "Hi there mover and shaker!")
// }

// handles routing
func main() {
  fmt.Println("Go server, go! https://192.168.55.103:8443")
  // run the hub to start websockets
  go h.run()

  // gorilla router
  r := mux.NewRouter()

  // websocket endpoint
  r.HandleFunc("/ws/{channel}", serveWS)

  /* ======>API<====== */
  // Sessions table

  /* <======end API======> */

  // Serve static files (make sure index has /client at start, so paths match)
  s := http.StripPrefix("/client", http.FileServer(http.Dir("client")))
  r.PathPrefix("/client").Handler(s)

  // serve index.html to root, or any path we don't recognise.
  r.HandleFunc("/", serveIndex)
  r.NotFoundHandler = http.HandlerFunc(serveIndex)

  // start 'er up.
  log.Fatal(http.ListenAndServeTLS(PORTSSL, PUBLIC_KEY, PRIV_KEY, r))
  // log.Fatal(http.ListenAndServe(PORTREG, r))
}
func serveIndex(w http.ResponseWriter, r *http.Request) {
  http.ServeFile(w, r, "client/index.html")
}
