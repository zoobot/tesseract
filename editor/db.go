package main

import (
  "fmt"
  "net/http"
  "gopkg.in/mgo.v2"
  // "gopkg.in/mgo.v2/bson"
)

/* ======>Database Handlers<====== */
func saveDoc(w http.ResponseWriter, r *http.Request) {
  w.WriteHeader(200)
  fmt.Fprintf(w, "This is a POST request too, /%s! ", r.URL.Path[1:])
}

func retrieveDoc(w http.ResponseWriter, r *http.Request) {
  w.WriteHeader(200)
  fmt.Fprintf(w, "This is a GET request too, /%s! ", r.URL.Path[1:])
}

func updateDoc(w http.ResponseWriter, r *http.Request) {
  w.WriteHeader(200)
  fmt.Fprintf(w, "This is a PUT request too, /%s! ", r.URL.Path[1:])
}

func deleteDoc(w http.ResponseWriter, r *http.Request) {
  w.WriteHeader(200)
  fmt.Fprintf(w, "This is a DELETE request too, /%s! ", r.URL.Path[1:])
}
/* <=======end Database Handlers======> */
/* ======>Database Connection<====== */
func getSession() *mgo.Session {
  // Connect to out local mongo
  s, err := mgo.Dial("mongodb://localhost")

  // Check if connection error, is mongo running?
  if err != nil {
    panic(err)
  }
  return s
}
/* <=======end Database Connection======> */
