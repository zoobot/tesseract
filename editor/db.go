package main

import (
  "fmt"
  "net/http"
  "encoding/json"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
)
/* ======>User Schema<====== */
type(
  User struct {
    Id bson.ObjectId `json:"id" bson:"_id,omitempty"`
    UserName string `json:"username" bson:"username"`
    Password string `json:"password" bson:"password"`
    Saved string `json:"saved" bson:"saved"`
  }
)
/* ======>Database Handlers<====== */
// CreateUser creates a new user resource
func CreateUser(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(404)
    return
  }
  defer session.Close()

  // Stub a user to be populated from the body
  u := User{}

  // Populate the user data
  if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
    w.WriteHeader(404)
    return
  }

  // Add an id
  u.Id = bson.NewObjectId()

  session.DB("tesis").C("people").Insert(u)

  // Make response into json
  uj, _ := json.Marshal(u)

  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(201)
  // Return id for storage in session
  fmt.Fprintf(w, "%s", uj)
}

func GetUser(w http.ResponseWriter, r *http.Request) {

  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(404)
    return
  }
  defer session.Close()

  var results []User

  c := session.DB("tesis").C("people")
  err = c.Find(bson.M{}).Sort("-timestamp").All(&results)
  if err != nil {
    w.WriteHeader(404)
    return
  }

  uj, _ := json.Marshal(results)

  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(200)
  fmt.Fprintf(w, "GET request, %s! ", uj)
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(404)
    return
  }
  defer session.Close()

  session.DB("tesis").C("people").RemoveAll(bson.M{})

  // Make response into json
  uj, _ := json.Marshal("done")

  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(201)
  // Return id for storage in session
  fmt.Fprintf(w, "%s", uj)
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(404)
    return
  }
  defer session.Close()

  // Stub a user to be populated from the body
  u := User{}

  // Populate the user data
  if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
    w.WriteHeader(404)
    return
  }

  var g float64

  session.DB("tesis").C("people").Find(bson.M{"username": "1111111111"}).One(&g)

  // Make response into json
  uj, _ := json.Marshal(g)

  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(201)
  // Return id for storage in session
  fmt.Fprintf(w, "%s", uj)
}
/* <=======end Database Handlers======> */
