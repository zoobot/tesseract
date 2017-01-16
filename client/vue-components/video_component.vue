<template>

    <div>
      <div id="buttonContainer"><button @click="call()" id="callButton" >C</button>
      <button @click="record()" id="record" >R</button>
      <button @click="download()" id="download" >D</button>
      <button @click="screen()" id="screen" >S</button>
      </div>

      <div><video id="localVideo" @click="toggleAudioMute()" muted="true" autoplay></video></div>
      <div><video id="remoteVideo" muted="remoteMuted" autoplay></video></div>

    </div>


</template>

<script>
  import Utils from '../js/utils.js'
  import Methods from '../js/webrtc.js'
  export default {

    mounted() {
      console.log('videocomponent mounted, this.wsrtc:', this.wsrtc)
      console.log('videocomponent mounted, this.URI:', this.uri)
      this.start();
      this.wsrtc.onmessage = e => {
        this.signalHandler(e)
      };
      console.log('this.remoteMuted at start', this.remoteMuted)
    },

    props: ['wsrtc','uri'],

    data() {
        return {
          ourAnswer:'',
          otherSDP:'',
          iceCandidates:[],
          pc: null,
          localStream:'',
          localVideo:'',
          theRecorder: null,
          recordedChuck: [],
          remoteVideo:'',
          remoteMuted: false,
          peerConnectionConfig: {'iceServers': [{'url': 'stun:stun.l.google.com:19305'}, {'url': 'stun:stun.services.mozilla.com'}]},
        }
    },

    methods: {
    //eventually we can port all these methods into a js file
      start() {
        //this tells the getUserMedia what data to grab and set in the MediaStream object that the method produces,
        //which is then used in the success callback on the MediaStream object that contains the media stream
          navigator.mediaDevices.getUserMedia({
            audio: {
            googEchoCancellation: true,
            googAutoGainControl: true,
            googNoiseSuppression: true,
            googHighpassFilter: true,
            googEchoCancellatio2n: true,
            googAutoGainControl2: true,
            googNoiseSuppression2: true,
            googHighpassFilter2: true
            },
            video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            frameRate: { min: 1, max: 15 }
          }})
          .then(this.gotStream)
          .catch(e => { console.log('getUserMedia() error: ' + e.name);});
      },

      gotStream(stream) {

        this.localVideo = document.getElementById('localVideo');
        //set source of localVideo element to the stream captures from getUserMedia
        this.localVideo.src = window.URL.createObjectURL(stream);
        // set localStream equal to this stream
        this.localStream = stream;
        // instantiate new peer connection
        this.pc = new RTCPeerConnection(this.peerConnectionConfig);
        // set methods on new peer connection object
        this.pc.addStream(this.localStream)


        this.pc.onaddstream = e => {
        //event handler for setRemoteDescription: adds remote stream src to DOM
            this.remoteVideo = document.getElementById('remoteVideo');
            this.remoteVideo.src = window.URL.createObjectURL(e.stream);
        }
        //on initial reception of icecandidates...
        this.pc.onicecandidate = e => {
          //send ice candidates over WS signaling server
          if(e.candidate != null) {
            this.wsRTC.send(JSON.stringify({'ice': e.candidate}));
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
          this.wsRTC.send(JSON.stringify({'sdp': offer}))
        })
        .catch(e => { console.log('err offer setLocalDescription', e);})
      },

      signalHandler(e) {

          let signal = JSON.parse(e.data);

            if(signal.ToggleMediaStreamTrack) {
            //if signal is media stream muter, mute the remote video stream
                this.remoteMuted = !this.remoteMuted;
                console.log('muted from other side', signal, this.remoteMuted);
                document.getElementById("remoteVideo").muted = this.remoteMuted;
                console.log(this.remoteMuted, 'this.isremotedMuted in mute signal')
            }

            if (signal.sdp && signal.sdp.type === 'offer' && signal.sdp !== this.pc.localDescription) {
            console.log('this is a signal', signal)
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
                this.wsRTC.send(JSON.stringify({ 'sdp': this.ourAnswer }));
              })
              .catch(e => { console.log('err at offer', e);})

          }

          if (signal.ice) {
          //add ice candidates to iceCandidates array in data
            this.iceCandidates.push(signal.ice)
          }

          if (signal.sdp && signal.sdp.type === 'answer' && signal.sdp !== this.pc.localDescription) {
            console.log('this is a signal', signal.sdp)
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
      },



      toggleAudioMute() {

      let audio = this.localStream.getAudioTracks();
         this.wsRTC.send(JSON.stringify(
           {ToggleMediaStreamTrack: true,
            mediaStreamLabel: audio.label
           })
         )
        console.log('toggleAudio signaled')
        console.log(this.remoteMuted, 'this.isremotedMuted in toggleAudio')
      }

      //hangUp() {
        //console.log('in hangUp')

        //document.getElementById("localVideo").muted = !this.muted;
        //document.getElementById("remoteVideo").muted = !this.muted;
        // this.pc.onstream = function (e) {

        //   if (e.type === 'local') {
        //       window.streamid = e.streamid;
        //       connection.streams[e.streamid].mute({
        //           audio: true,
        //           video: true
        //       });
        //   }
        // };
      //}



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
