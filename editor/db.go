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
  Saved struct {
    File string `json: "file" bson:"file"`
  }
  User struct {
    Id bson.ObjectId `json:"id" bson:"id,omitempty"`
    UserName string `json:"username" bson:"username"`
    Email string `json:"email" bson:"email"`
    Password string `json:"password" bson:"password"`
    Avatar string `json:"avatar" bson:"avatar"`
    // Saved []Saved `json:"saved", bson:"saved"`
  }
)
/* ======>Database Handlers<====== */
// CreateUser creates a new user resource
func CreateUser(w http.ResponseWriter, r *http.Request) {
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(401)
    return
  }
  defer session.Close()

  session.SetMode(mgo.Monotonic, true)
  c := session.DB("tesis").C("people")
  // Stub a user to be populated from the body
  var u User
  // Add an id
  u.Id = bson.NewObjectId()
  // Populate the user data
  if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
    fmt.Println(u)
    w.WriteHeader(401)
    return
  }
  // Access db collection
  // Index creates unique identifiers to look for. Here we will make sure the username is unique
  index := mgo.Index{
    Key:        []string{"id"},
    Unique:     true,
    DropDups:   true,
    Background: true,
    Sparse:     true,
  }
  // Check if username is unique
  err = c.EnsureIndex(index)
  err = c.Insert(u)
  if err != nil {
    // If db already contains username return data w/id  and status code 200
    c.Find(bson.M{"username": u.UserName}).One(&u)
    w.WriteHeader(200)
  } else {
    // If not found respond with status code 201.
    w.WriteHeader(201)
  }
  // Make response into json
  uj, _ := json.Marshal(u)
  // Write content-type, statuscode, payload
  w.Header().Set("Content-Type", "application/json")
  // Return id for storage in session
  fmt.Fprintf(w, "%s", uj)
}

// GetUser gets a user resource
func GetUser(w http.ResponseWriter, r *http.Request) {
// finds by id :o
  session, err := mgo.Dial("mongodb://localhost:27017")
  if err != nil {
    w.WriteHeader(404)
    return
  }
  defer session.Close()

  c := session.DB("tesis").C("people")

  var results []User

  if err := r.ParseForm(); err != nil {
    return
  }

  if _, ok := r.Form["id"]; ok {
  // Params -->  ?id=1234565tgrfe34
    fmt.Println(r.Form)
    err = c.Find(bson.M{"id": bson.ObjectIdHex(r.Form.Get("id"))}).All(&results)
    if err != nil {
      w.WriteHeader(401)
      return
    }
    uj, _ := json.Marshal(results)
    w.WriteHeader(200)
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprintf(w, "%s", uj)
  } else if _, ok := r.Form["username"]; ok {
  // Params -->  ?username=Sally123!
    err = c.Find(bson.M{"username": r.Form.Get("username")}).All(&results)
    if err != nil {
      w.WriteHeader(401)
      return
    }
    uj, _ := json.Marshal(results)
    w.WriteHeader(200)
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprintf(w, "%s", uj)
  } else {
  // No params
     err = c.Find(bson.M{}).Sort("-timestamp").All(&results)
    if err != nil {
      w.WriteHeader(404)
      return
    }
    uj, _ := json.Marshal(results)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(200)
    fmt.Fprintf(w, "%s", uj)
  }
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
