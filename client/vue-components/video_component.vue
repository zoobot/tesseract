<template>

    <div>
      <div id="buttonContainer">
      <button @click="record()" id="record" >R</button>
      <button @click="download()" id="download" >D</button>
      <button @click="screen()" id="screen" >S</button>
      </div>

        <button @click="stop()" id="stop">Stop</button>
        <button v-show="collaborate" @click="start()" id="collaborate" >collaborate++</button>
        <button v-show= "connect" @click="call()" id="connect">click to connect</button>
        <button @click="toggleMute()" id="mute">mute</button>
        <div id="video-container"></div>

    </div>


</template>

<script>
  import Utils from '../js/utils.js'
  import Methods from '../js/webrtc.js'
  export default {

    mounted() {

      this.gainNode();
      this.signalHandler();

    },

    props: ['wsrtc','uri'],

    data() {
        return {
          collaborate: true,
          connect: false,
          ourAnswer:'',
          otherSDP:'',
          iceCandidates:[],
          pc: null,
          localStream:'',
          localVideo:'',
          theRecorder: null,
          recordedChuck: [],
          remoteVideo:'',
          peerConnectionConfig: {'iceServers': [{'url': 'stun:stun.l.google.com:19305'}, {'url': 'stun:stun.services.mozilla.com'}]},
        }
    },

    methods: {

      gainNode() {
      let context = new AudioContext();
      let sineWave = context.createOscillator();
        // Declare gain node
      let gainNode = context.createGain();
        // Connect sine wave to gain node
        sineWave.connect(gainNode);
        // Connect gain node to speakers
        gainNode.connect(context.destination);
        gainNode.gain.value = 0.9;
      },

    //eventually we can port all these methods into a js file
      start() {
        this.startCollab();
        //this tells the getUserMedia what data to grab and set in the MediaStream object that the method produces,
        //which is then used in the success callback on the MediaStream object that contains the media stream
         navigator.mediaDevices.getUserMedia({ audio: {
         googAutoGainControl: false
         }, video: true})
         .then (stream => {
        // set localStream equal to this stream
            this.localStream = stream
          })
         .catch(e => { console.log('getUserMedia() error: ' + e.name);});

      },

      startCollab()  {
          this.wsrtc.send(JSON.stringify({'type':'join'}));
          this.wsrtc.send(JSON.stringify({'type': 'joinUp'}))
      },

      gotStream(stream) {
        //set button displays
        this.collaborate = false;
        //set source of localVideo element to the stream captures from getUserMedia
        //this.localVideo = document.getElementById('localVideo');
        //this.localVideo.src = window.URL.createObjectURL(this.localStream);
        this.videos = document.getElementById('video-container');
        let localVideo = document.createElement('video')
        this.videos.appendChild(localVideo);
        localVideo.src = URL.createObjectURL(this.localStream);
        localVideo.autoplay = true;
        localVideo.setAttribute("muted", true);
        localVideo.setAttribute("id", this.localStream.id);
        // instantiate new peer connection
        this.pc = new RTCPeerConnection(this.peerConnectionConfig);
        // set methods on new peer connection object
        this.pc.addStream(this.localStream)

        this.pc.onaddstream = e => {
        //event handler for setRemoteDescription: adds remote stream src to DOM
            if (!document.getElementById(e.stream.id)) {
              let otherVideo = document.createElement('video');
              this.videos.appendChild(otherVideo);
              otherVideo.src = URL.createObjectURL(e.stream);
              otherVideo.autoplay = true;
              otherVideo.setAttribute("id", e.stream.id);
              otherVideo.setAttribute("muted", false);
            }
        }
        //on initial reception of icecandidates...
        this.pc.onicecandidate = e => {
          //send ice candidates over WS signaling server
          if(e.candidate != null) {
            this.wsrtc.send(JSON.stringify({'ice': e.candidate}));
            this.connect = true;
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
          this.wsrtc.send(JSON.stringify({'sdp': offer}))
        })
        .catch(e => { console.log('err offer setLocalDescription', e);})
      },

      toggleMute() {

      let id = this.localStream.id;
        this.wsrtc.send(JSON.stringify(
          {'type': 'toggleMute',
          'id': id
          })
        )
      },


      stop() {
        this.pc.removeStream(this.localStream);
        this.wsrtc.send(JSON.stringify({'type':'stop', 'id': this.localStream.id}));
      },

      signalHandler() {

        this.wsrtc.onmessage = e => {

          let signal = JSON.parse(e.data);

            if (signal.type === 'stop') {
              var r = document.getElementById(signal.id);
              this.videos.removeChild(r);
              this.connect = false;
              this.collaborate = true;
            }

            if (signal.type === 'toggleMute') {
              var r = document.getElementById(signal.id);
              r.muted = !r.muted;
            }

            if (signal.type === 'join') {
              this.collaborate = false;
              this.connect = true;
            }

            if (signal.type === 'joinUp') {

                if(this.localStream) {
                  this.gotStream(this.localStream);
                } else {
                  navigator.mediaDevices.getUserMedia({ audio: true, video: true})
                  .then (stream => {
                // set localStream equal to this stream
                    this.localStream = stream
                  })
                  .then(stream => {
                    this.gotStream(stream)
                  })
                }
            }

            if (signal.sdp && signal.sdp.type === 'offer' && signal.sdp !== this.pc.localDescription) {
            //if signal is offer and we are the callee, set SDP offer as remote description
              this.pc.setRemoteDescription(signal.sdp)
              //attach our local stream to the peerConnection object
              .then(() => this.pc.addStream(this.localStream))
              //create answer
              .then(() => this.pc.createAnswer())
              //set this answer as our local description
              .then(answer => {this.ourAnswer = answer; this.pc.setLocalDescription(answer)})
              //send this answer along with our local stream data over WS signaling server
              .then(() => {
                this.wsrtc.send(JSON.stringify({ 'sdp': this.ourAnswer }));
              })
              .catch(e => { console.log('err at offer', e);})

          }

            if (signal.ice) {
           //add ice candidates to iceCandidates array in data
              this.iceCandidates.push(signal.ice)
            }

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
            .catch(e => { console.log('err at answer', e)})
           }
         }
      },

      record() {
        try {
          MediaRecorder = new MediaRecorder(this.localStream, {mimeType: "video/webm"});
        } catch (e) { console.log('Recording issues', e); return }

        this.theRecorder = MediaRecorder;
        MediaRecorder.ondataavailable = e => { this.recordedChuck.push(e.data);}
        MediaRecorder.start(100);
      },

      screen() {
        console.log('in screen')
        var receiver = null;
        // chrome.browserAction.onClicked.addListener(function(tab) {
        //   chrome.tabCapture.capture(
        //     {video: true, audio: true,
        //      videoConstraints: {
        //        mandatory: {
        //           maxWidth: 720,
        //           maxHeight: 480,
        //           minFrameRate: 1,
        //           maxFrameRate: 15,
        //           minAspectRatio: 1.77 // 2.39
        //        },
        //      },
        //     },

        //     function(stream) {
        //       console.log('stream',stream)
        //       if (!stream) {
        //         console.error('Error starting tab capture: ' +
        //                       (chrome.runtime.lastError.message || 'UNKNOWN'));
        //         return;
        //       }
        //       if (receiver != null) {
        //         receiver.close();
        //       }
        //       receiver = window.open('receiver.html');
        //       // receiver = document.createElement('leStuff');
        //       // document.body.appendChild(receiver);
        //       receiver.currentStream = stream;
        //     }
        //   );
        // });
      },

      download() {
        this.theRecorder.stop();
        this.localStream.getTracks().forEach(track => { track.stop(); });

        var blob = new Blob(this.recordedChuck, {type: "video/mp4"});
        var url =  URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        //make rand number padd 4
        var rand =  ('0000' + Math.floor((Math.random() * 1000))).slice(-4);
        a.download = this.saverURI + rand +'.mp4';
        a.click();
        // setTimeout() here is needed for Firefox.
        setTimeout(function() { URL.revokeObjectURL(url); }, 100);
      }
    }
  }
</script>

<style>
  video {
    display: inline-block;
    max-width: 100%;
  }
  button {
    width: 100%
  }
</style>
