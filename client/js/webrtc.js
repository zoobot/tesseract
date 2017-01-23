module.exports = {

  start() {
    this.wsrtc.send(JSON.stringify({ 'type': 'join' }));
    this.wsrtc.send(JSON.stringify({ 'type': 'joinUp' }))
      //this tells the getUserMedia what data to grab and set in the MediaStream object that the method produces,
      //which is then used in the success callback on the MediaStream object that contains the media stream
    navigator.mediaDevices.getUserMedia({
        audio: {
          googAutoGainControl: false,
          echoCancellation: false
        },
        video: true
      })
      // set localStream equal to this stream
      .then(stream => { this.localStream = stream })
      // .then(this.gotStream)
      .catch(e => { console.log('getUserMedia() error: ' + e.name); });
  },



  gotStream(stream) {
    //set button displays
    this.collaborate = false;
    this.end = true;
    //set source of localVideo element to the stream captures from getUserMedia;
    this.videos = document.getElementById('video-container');
    let localVideo = document.createElement('video')
    if (document.getElementById('video-container').children.length < 1) {
      this.videos.appendChild(localVideo);
    }

    localVideo.src = URL.createObjectURL(this.localStream);
    localVideo.setAttribute("autoplay", true);
    // localVideo.setAttribute("muted", true);
    localVideo.setAttribute("id", this.localStream.id);
    // instantiate new peer connection
    this.pc = new RTCPeerConnection(this.peerConnectionConfig);
    // set methods on new peer connection object
    this.pc.addStream(this.localStream)

    this.pc.onaddstream = e => {
        //event handler for setRemoteDescription: adds remote stream src to DOM
        let otherVideo = document.createElement('video')
        otherVideo.src = window.URL.createObjectURL(e.stream);
        if (document.getElementById('video-container').children.length < 2) {
          this.videos.appendChild(otherVideo);
          console.log('children are too few')
        }


        otherVideo.src = URL.createObjectURL(e.stream);
        otherVideo.setAttribute("autoplay", true);
        otherVideo.muted = false;
        otherVideo.setAttribute("id", e.stream.id);
        //send connected signal
        this.connected = false;
        this.end = true;
        this.wsrtc.send(JSON.stringify({ 'type': 'connected' }));

      }
      //on initial reception of icecandidates...
    this.pc.onicecandidate = e => {
      //send ice candidates over WS signaling server
      if (e.candidate != null) {
        this.wsrtc.send(JSON.stringify({ 'ice': e.candidate }));
        this.connected = true;
        this.end = true;
      }
    }
  },

  call() {
    //call to create initial offer
    this.pc.createOffer()
      .then(offer => {
        //set local description to own SDP offer
        this.pc.setLocalDescription(offer);
        //send offer over WS signaling server
        console.log(offer)
        this.wsrtc.send(JSON.stringify({ 'sdp': offer }))
      })

    .catch(e => { console.log('err offer setLocalDescription', e); })
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
        this.collaborate = false;
        this.connected = true;
      };

      if (signal.type === 'joinUp') {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
          .then(this.gotStream)
          .catch(e => { console.log('getUserMedia()err: ', e.name); });
      };

      if (signal.type === 'connected') {
        //connect button remains
        this.connected = true;
        console.log('yeaa', this.connected)
      };

      if (signal.sdp && signal.sdp.type === 'offer' && signal.sdp !== this.pc.localDescription) {
        //if signal is offer and we are the callee, set SDP offer as remote description
        this.pc.setRemoteDescription(signal.sdp)
          //attach our local stream to the peerConnection object
          .then(() => this.pc.addStream(this.localStream))
          //create answer
          .then(() => this.pc.createAnswer())
          //set this answer as our local description
          .then(answer => { this.ourAnswer = answer;
            this.pc.setLocalDescription(answer) })
          //send this answer along with our local stream data over WS signaling server
          .then(() => {
            this.wsrtc.send(JSON.stringify({ 'sdp': this.ourAnswer }));
          })
          .catch(e => { console.log('err at offer', e); })

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
