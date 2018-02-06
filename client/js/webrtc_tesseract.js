module.exports = {

  async start() {
    try {
      await this.wsrtc.send(JSON.stringify({'type': 'join' }))
      await this.wsrtc.send(JSON.stringify({'type': 'joinUp' }))
    } catch (error) {
      console.log('start error: ' + error.name)
    }
  },

  async joinUp() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            googAutoGainControl: false,
            echoCancellation: false
          },
          video: true
        })
      this.localStream = await stream
      this.gotStream(await stream)
    } catch (error) {
      console.log('getUserMedia() error: ' + error.name)
    }
  },

  gotStream(stream) {
    const pc1 = document.getElementById('pc1')
    pc1.src = URL.createObjectURL(this.localStream)
    pc1.setAttribute("class","local-video-start")


    // instantiate new peer connection
    this.pc = new RTCPeerConnection(this.peerConnectionConfig)
    // set methods on new peer connection object
    this.pc.addStream(this.localStream)
    this.pc.onaddstream = e => {
        //event handler for setRemoteDescription: adds remote stream src to DOM

        const pc2 = document.getElementById('pc2')
        pc2.src = URL.createObjectURL(e.stream)
        pc2.setAttribute("class","remote-video-connected")
        pc1.setAttribute("class","local-video-connected")
        //send connected signal
        this.connected = true
        // this.end = true
        this.wsrtc.send(JSON.stringify({ 'type': 'connected' }))

      }
      //on initial reception of icecandidates...
    this.pc.onicecandidate = e => {
      //send ice candidates over WS signaling server
      if (e.candidate != null) {
        this.wsrtc.send(JSON.stringify({ 'ice': e.candidate }))
        this.connected = true
        // this.end = true
      }
    }
  },

  async connect() {
    //call to create initial offer
    try {
      const newOffer = await this.pc.createOffer()
      this.newOffer = await newOffer
      //set local description to own SDP offer
      this.pc.setLocalDescription(await this.newOffer)
      //send offer over WS signaling server
      this.wsrtc.send(JSON.stringify({ 'sdp': await this.newOffer }))
    } catch(error) {
      console.log('err offer setLocalDescription', error)
    }
  },

  async offer(signal) {
    try {
      //if signal is offer and we are the callee, set SDP offer as remote description
      this.pc.setRemoteDescription(await signal.sdp)
        //attach our local stream to the peerConnection object
      const streamAdded = this.pc.addStream(await this.localStream)
      this.answer()
    } catch(e) { console.log('err at offer', e) }
  },

  async answer() {
    try {
      //create answer
      const newAnswer = await this.pc.createAnswer()
        //set this answer as our local description
      this.newAnswer = await newAnswer
      this.pc.setLocalDescription(await this.newAnswer)
        //send this answer along with our local stream data over WS signaling server
      this.wsrtc.send(JSON.stringify({ 'sdp': await this.newAnswer }))
    } catch(e) { console.log('err at offer', e) }
  },

    //toggles own mute
  toggleMute() {
    this.ourAudio = !this.ourAudio;
    let id = this.localStream.id;
    this.wsrtc.send(JSON.stringify({
      'type': 'toggleMute',
      'id': id
    }))
  },

  stop() {
    console.log('stop1')
    this.wsrtc.send(JSON.stringify({ 'type': 'stop', 'id': this.localStream.id }));
    //delete descriptions
    this.collaborate = true;
    this.connected = false;
    delete this.pc.localDescription;
    delete this.pc.remoteDescription;
  },



  signalHandler() {

    this.wsrtc.onmessage = e => {

      let signal = JSON.parse(e.data);

      if (signal.type === 'stop') {
        //remove video nodes
        console.log('stopsignal')
        while (this.videos.firstChild) {
          this.videos.removeChild(this.videos.firstChild);
        };
        //stop local media stream
        this.localStream.getTracks().forEach(track => {
          track.stop();
        })
        this.connected = false;
        this.collaborate = true;
        //delete descriptions
        delete this.pc.localDescription;
        delete this.pc.remoteDescription;
      };

      if (signal.type === 'toggleMute' && signal.id !== this.localStream.id) {
        var r = document.getElementById(signal.id);
        //toggle mute
        r.muted = !r.muted
        console.log(r, r.muted)
      };

      if (signal.type === 'join') {
        this.collaborate = true;
        this.connected = true;
      };

      if (signal.type === 'joinUp') {
        console.log('joined',signal.type)
        this.joinUp()
      };

      if (signal.type === 'connected') {
        //connect button remains
        this.connected = true;
        console.log('yeaa', this.connected)
      };

      if (signal.sdp && signal.sdp.type === 'offer' && signal.sdp !== this.pc.localDescription) {
        console.log('sdp.type offer', signal.sdp.type)
        this.offer(signal)
      };

      if (signal.ice) {
        //add ice candidates to iceCandidates array in data
        this.iceCandidates.push(signal.ice)
      };

      if (signal.sdp && signal.sdp.type === 'answer' && signal.sdp !== this.pc.localDescription) {
        //on reception of answer as caller, set SDP answer as remote description
        this.pc.setRemoteDescription(signal.sdp)
          .then(() => {
            if (this.pc.remoteDescription && this.iceCandidates.length > 0)
            //if the local and remote description has been set and ice candidates exist
              for (var i = 0; i < this.iceCandidates.length; i++) {
              //add ice candidates to peerConnection
              this.pc.addIceCandidate(this.iceCandidates[i])
            }
          })
          .catch(e => { console.log('err at answer', e) })
      }
    }
  },

  record() {
    //create new mediarecorder from local stream
    try {
      MediaRecorder = new MediaRecorder(this.localStream, { mimeType: "video/webm" });
    } catch (e) { console.log('Recording issues', e);
      return }

    this.theRecorder = MediaRecorder;
    MediaRecorder.ondataavailable = e => { this.recordedChuck.push(e.data); }
    MediaRecorder.start(100);
  },

  screen() {
    console.log('in screen')
    var receiver = null;
  },

  download() {
    //show collaborate button and stop button
    this.collaborate = true;
    this.end = true;
    //stop recording
    this.theRecorder.stop();
    //stop streams
    this.localStream.getTracks().forEach(track => { track.stop(); });
    //create new blob
    var blob = new Blob(this.recordedChuck, { type: "video/mp4" });
    //get url from dom for blob for download name
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    //add padd of 4
    var rand = ('0000' + Math.floor((Math.random() * 1000))).slice(-4);
    a.download = this.uri + rand + '.mp4';
    a.click();
    // setTimeout() here is needed for Firefox.
    setTimeout(function() { URL.revokeObjectURL(url); }, 100);
  }

}
