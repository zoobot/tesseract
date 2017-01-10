<template>

    <div>

        <!-- <button @click="start" id="startButton">Start</button> -->
        <div><button @click="call()" id="callButton" >Call</button></div>
        <!-- <button @click="stop" id="stopButton">Stop</button> -->
        <div><video id="localVideo" autoplay muted="true"></video></div>
        <div><video id="remoteVideo" autoplay></video></div>
    </div>
    <!--need to set remote videos to append to document to accomodate for multiple callers (maybe later feature?)-->
    <!--<div v-el="remoteVideo" id="remoteVideo">-->
    <!--<video id="remoteVideo" autoplay></video>-->

</template>

<style>
  video {
    display: inline-block;
    max-width: 100%;
  }
  button {
    width: 100%
  }
</style>
<script>
  import Utils from '../js/utils.js'
  import Methods from '../js/webrtc.js'
  export default {

    mounted() {
      this.start();
      this.joinCall();
    },

    props: ['wsRTC'],

    data() {
        return {
          ourAnswer:'',
          otherSDP:'',
          iceCandidates:[],
          pc: null,
          localStream:'',
          localVideo:'',
          remoteVideo:'',
          peerConnectionConfig: {'iceServers': [{'url': 'stun:stun.l.google.com:19305'}, {'url': 'stun:stun.services.mozilla.com'}]},
          constraints: { audio: true, video: true }
        }
    },

    methods: {
    //eventually we can port all these methods into a js file
      start() {
        //this tells the getUserMedia what data to grab and set in the MediaStream object that the method produces,
        //which is then used in the success callback on the MediaStream object that contains the media stream
          navigator.mediaDevices.getUserMedia({ audio: false, video: true})
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

      joinCall() {

        this.wsRTC.onmessage = e => {

          let signal = JSON.parse(e.data);

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
                this.wsRTC.send(JSON.stringify({ 'sdp': this.ourAnswer }));
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
              this.pc.addIceCandidate(this.iceCandidates[i]
              )}
            })
            .catch(e => { console.log('err at answer', e)})
          }
       }
      }
    }
  }
</script>