<template>

    <div>
        <video id="localVideo" autoplay></video>
        <video id="remoteVideo" autoplay></video>
        <button @click="start" id="startButton">Start</button>

        <button @click="call(true)" id="callButton">Call</button>
        <button @click="stop" id="stopButton">Stop</button>
    </div>
    <!--need to set remote videos to append to document to accomodate for multiple callers (maybe later feature?)-->
    <!--<div v-el="remoteVideo" id="remoteVideo">-->
    <!--<video id="remoteVideo" autoplay></video>-->

</template>

<style>
  video {
    display: inline-block;
    max-width: 100%;
    width: 150px
  }
</style>
<script>
  import Utils from '../js/utils.js'
  import Methods from '../js/webrtc.js'
  export default {
    created() {
    this.server = new WebSocket(this.serverConnection);
    },
    props: ['ws'],
    data() {
        return {
          server: '',
          serverConnection: this.ws.url + 'rtc',
          localStream:'',
          localVideo:'',
          userStreamOn: false,
          peerConnectionConfig: {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]},
          constraints: { audio: false, video: true }
        }
    },
    methods: {
    //eventually we can port all these methods into a js file
      start() {
        this.userStreamOn = !this.userStreamOn;
        if (this.userStreamOn) {
        //this tells the getUserMedia what data to grab and set in the MediaStream object that the method produces,
        //which is then used in the success callback on the MediaStream object that contains the media stream
          navigator.mediaDevices.getUserMedia({ audio: false,video: true })
          .then(this.gotStream)
          .catch(e => { console.log('getUserMedia() error: ' + e.name);});
        }
      },
      stop(stream) {
        //for (let track of stream.getTracks()) {
          //track.stop();
      //  }
        // this.userStreamOn = !this.userStreamOn;
        // mediaStream.stop();
        // localMediaStream.stop()
      },
      gotStream(stream) {
        this.localVideo = document.getElementById('localVideo');
        //NOTE: refer back to global scope data object here!!
        console.log ('Received local stream');
        //set source of localVideo element to the stream captures from getUserMedia
        this.localVideo.srcObject = stream;
        // set localStream equal to this stream
        this.localStream = stream;
      },
      call(isCaller) {
        // instantiate new peer connection
        let peerConnection = new RTCPeerConnection(this.peerConnectionConfig);
        // // set methods on new peer connection object
        peerConnection.onicecandidate = this.gotIceCandidate;
        peerConnection.onaddstream = this.gotRemoteStream;
        peerConnection.addStream(this.localStream)
        if(isCaller) {
            peerConnection.createOffer()
           .then(offer => {peerConnection.setLocalDescription(offer);this.server.send(JSON.stringify({'sdp': offer}));console.log('this is our offer', offer)})
           .catch(e => { console.log('err', e);})
         }
      },
     // serverConnection.onmessage(message) {
     //   console.log('received message from server!');
     //    if(!peerConnection) start(false);
     //    var signal = JSON.parse(message.data);
     //    if(signal.sdp) {
     //      peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
     //        peerConnection.createAnswer(gotDescription, createAnswerError);
     //    });
     //    } else if(signal.ice) {
     //       peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
     //   }
     // },


      gotIceCandidate(event) {
        if(event.candidate != null) {
         // console.log('this is our ice candidate', event.candidate)
          this.server.send(JSON.stringify({'ice': event.candidate}));
        }
      },
      gotRemoteStream(event) {
        console.log("got remote stream");
        remoteVideo.src = window.URL.createObjectURL(event.stream);
      }
    }
  }
</script>