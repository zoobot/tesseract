## Duncan's notes ##

###Global install###
  1. karma-cli
  2. jasmine
  3. webpack
  4. browserify
  5. watchify

###Dependancies###
  1. npm install

###Start server###
  1. Checkout Neville.md

###Start Webpack###
  1. run -> webpack -w

###Test###
  1. run -> karma start
  2. go to http://localhost:9876/debug.html
  3. tests run inside the console.

###Data Base###
  1. POST
    i. "/db"
      * `code`

    ii. "/db/addfile"

    iii. "/db/deletefile"






  r.HandleFunc("/db", CreateUser).Methods("POST")
  r.HandleFunc("/db/addfile", AddFile).Methods("POST")
  r.HandleFunc("/db/deletefile", DeleteFile).Methods("POST")
  r.HandleFunc("/db", GetUser).Methods("GET")
  r.HandleFunc("/db", UpdateUser).Methods("PUT")
  r.HandleFunc("/db", DeleteUser).Methods("DELETE")

