const http = require('http')
const https = require('https')
const tls = require('tls')
const fs = require('fs')
const express = require('express')
const ShareDB = require('sharedb')
const Logger = require('sharedb-logger')
const db = require('sharedb-mongo')('mongodb://localhost:27017/data')
const richText = require('rich-text')
const WebSocket = require('ws')
const WebSocketJSONStream = require('websocket-json-stream')
const bodyParser = require('body-parser')

ShareDB.types.register(richText.type)
const backend = new ShareDB({db})
const logger = new Logger(backend)



startServer()

var options = {
  cert : fs.readFileSync("./cert.pem"),
  key  : fs.readFileSync("./key.pem"),
  NPNProtocols: ['http/2.0', 'spdy', 'http/1.1', 'http/1.0']
};

function startServer() {
  const app = express();
 app.set('port', (process.env.PORT || 3000));
app.set('port', (process.env.PORT || 8444));


  app.use(express.static(__dirname + '/../client'));
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  const router = require('./routes')(app, express)
  app.use('/', router)

  const httpServer = http.createServer(app);
  // const server = https.createServer(options, app);
  var httpsServer = https.createServer({
  cert : fs.readFileSync("./cert.pem"),
  key  : fs.readFileSync("./key.pem"),
    NPNProtocols: ['http/2.0', 'spdy', 'http/1.1', 'http/1.0']
}, app)

  // Connects any incoming WebSocket connection to ShareDB
  let wss = new WebSocket.Server({server:  httpsServer});
  wss.on('connection', function(ws, req) {
    let stream = new WebSocketJSONStream(ws)
    backend.listen(stream)
  })

httpServer.listen(3000, function() {
  console.log('Node app is running on port', 3000);
});

httpsServer.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

  // httpServer.listen(3000)
  // httpsServer.listen(8444);
  // console.log('Listening on 3K')
}
