# Tesseract #
## A WebRTC client and server based off Tesis ##

* * *

### Getting the app started ###

* This is a Golang app so be sure to clone this repo into your Gopath
* Typical gopath: $GOPATH/src/github.com/~github username~/~repo~
* For help getting started with Golang checkout https://golang.org/doc/install
* Directions are in correct order

* * *

### Global install requirements ###

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
  * /usr/bin/certbot certonly --standalone --email user@email.com -d domain.com

* From inside tesseract/server
  * go build .

* * *

### Module Bundler ###

* webpack -w

* * *

### Server ###

* Go server - used for webRTC
  * from root
    * go run server/*.go

* * *
