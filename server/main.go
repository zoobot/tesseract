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
  // local
  // PORTSSL = ":8443"
  // PORTREG = ":8000"
  // certMaker.go
  PUBLIC_KEY = "./cert.pem"
  PRIV_KEY   = "./key.pem"
  // deploy
  PORTSSL = ":443"
  PORTREG = ":80"
  // certbot
  PUBLIC_KEY = "./fullchain.pem"
  PRIV_KEY   = "./privkey.pem"
)

func redirectTLS(w http.ResponseWriter, r *http.Request) {
  http.Redirect(w, r, "https://"+r.Host+r.RequestURI, http.StatusMovedPermanently)
  fmt.Fprintf(w, "moving http to http as required")
}

// go func() {
//     if err := http.ListenAndServe(":80", http.HandlerFunc(redirectTLS)); err != nil {
//         log.Fatalf("ListenAndServe error: %v", err)
//     }
// }()

// handles routing
func main() {
  fmt.Println("Go server, go! https://localhost:8443")
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

  // if err := http.ListenAndServe(":80", http.HandlerFunc(redirectTLS)); err != nil {
  //   log.Fatalf("ListenAndServe error: %v", err)
  // }
  // start 'er up.
  log.Fatal(http.ListenAndServeTLS(PORTSSL, PUBLIC_KEY, PRIV_KEY, r))
  log.Fatal(http.ListenAndServe(PORTREG, http.HandlerFunc(redirectTLS)))
  // log.Fatal(http.ListenAndServe(PORTREG, r))
}

func serveIndex(w http.ResponseWriter, r *http.Request) {
  http.ServeFile(w, r, "client/index.html")
}
