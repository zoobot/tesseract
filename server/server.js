var express = require("express")
var app = express();

var port = process.env.PORT || 1337;

app.listen(port, function() {
  console.log("you are now listening to something very", port)
})

app.get('/', function(req, res) {
  res.status(200).send({message: 'CELEBRATE FOR THE SERVER IS FUNCTIONING'})
});