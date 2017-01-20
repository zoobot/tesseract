# Tesis #
## A Collaborative Editor from the future! ##

* * *

### Getting the app started ###
* This is a Golang app so be sure to clone this repo into your Gopath
* Typical gopath: $GOPATH/src/github.com/~github username~/~repo~
* For help getting started with Golang checkout https://golang.org/doc/install
* Directions are in correct order

* * *

### Global install requirements ###

*  npm install karma-cli -g
*  npm install jasmine -g
*  npm install webpack -g

* * *

### Application dependancies ###

* Javascript
  * npm install

* Golang
  * go get golang.org/x/crypto/bcrypt
  * go get github.com/gorilla/mux
  * go get github.com/gorilla/websocket
  * go get gopkg.in/mgo.v2/bson
  * go get github.com/dchest/uniuri

* * *

### Build Go files ###

* From root
  * go build certMaker.go (builds a self signed cert for https)

* From inside tesis/editor
  * go build .

* * *

### Module Bundler ###

* webpack -w

* * *

### Servers ###

* Node server - used for running OT with shareDB
  * npm start

* Go server - used for webRTC, API, and editor stats
  * from root
    * go run editor/*.go

* * *
