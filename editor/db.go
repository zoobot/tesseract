package main

import (
  "fmt"
  "net/http"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
)
/* ======>User Schema<====== */
type User struct {
  id       bson.ObjectId `bson:"_id,omitempty"`
  userName string
  password string
}

var (
  IsDrop = true
)
/* ======>Database Handlers<====== */
func CreateUser(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    panic(err)
  }

  c := session.DB("tesis").C("users")

  err = c.Insert(&User{userName: "Ale", password: "1234"},
    &User{userName: "Cla", password: "1234"})
  if err != nil {
    panic(err)
  }

  result := User{}

  // err = c.Find(bson.M{}).All(&result)
  // if err != nil {
  //   panic(err)
  // }

  w.WriteHeader(201)
  fmt.Fprintf(w, "POST request added, %s! ", result)
}

func GetUser(w http.ResponseWriter, r *http.Request) {

  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    panic(err)
  }

  var results []User
  c := session.DB("tesis").C("users")
  err = c.Find(bson.M{}).Sort("-timestamp").All(&results)

  if err != nil {
    panic(err)
  }

  w.WriteHeader(200)
  fmt.Fprintf(w, "GET request response, %s! ", results)
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {

  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    panic(err)
  }

  c := session.DB("tesis").C("users")
  err = c.RemoveAll(bson.M{})
  if err != nil {
    panic(err)
  }

  w.WriteHeader(200)
  fmt.Fprintf(w, "DELETE successful")
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {

  w.WriteHeader(200)
  fmt.Fprintf(w, "This is a PUT request too, /%s! ", r.URL.Path[1:])
}
/* <=======end Database Handlers======> */
