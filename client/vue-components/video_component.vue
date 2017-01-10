<template>

    <div>

        <!-- <button @click="start" id="startButton">Start</button> -->
        <div><button @click="call()" id="callButton" >Call</button></div>
        <!-- <button @click="stop" id="stopButton">Stop</button> -->
        <div><video id="localVideo" autoplay muted="true"></video></div><br><br>
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
      this.wsRTC.onmessage = e => {

          let signal = JSON.parse(e.data);

            if (signal.sdp && signal.sdp.type === 'offer' && signal.sdp !== this.peerConnectionLocal.localDescription) {
              this.peerConnectionLocal.setRemoteDescription(signal.sdp)
              .then(() => this.peerConnectionLocal.addStream(this.localStream))
              .then(() => this.peerConnectionLocal.createAnswer())
              .then(answer => {this.ourAnswer = answer; this.peerConnectionLocal.setLocalDescription(answer)})
              .then(() => {
                this.wsRTC.send(JSON.stringify({ 'sdp': this.ourAnswer }));
                //console.log('this is the peerConnection', this.peerConnectionLocal)
              })
              .catch(e => { console.log('err ice candidate fail', e);})

           }

          if (signal.ice) {
              this.iceCandidates.push(signal.ice)
           }

          if (signal.sdp && signal.sdp.type === 'answer' && signal.sdp !== this.peerConnectionLocal.localDescription) {
            console.log('peerConnection at answer!', this.peerConnectionLocal)
            this.peerConnectionLocal.setRemoteDescription(signal.sdp)
            .then(() => {
              //console.log('your ice candidates',this.iceCandidates)
              if (this.peerConnectionLocal.remoteDescription && this.iceCandidates.length > 0)
              for (var i = 0; i < this.iceCandidates.length; i++) {
              this.peerConnectionLocal.addIceCandidate(this.iceCandidates[i]
              )}
            })
            .catch(e => { console.log('err at answer', e)})
            //console.log('now our peerConnection looks like this!', this.peerConnectionLocal)
           }
         }

    },

    props: ['ws', 'wsRTC'],

    data() {
        return {
          ourAnswer:'',
          otherSDP:'',
          iceCandidates:[],
          peerConnectionLocal: null,
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
          navigator.mediaDevices.getUserMedia({ audio: true, video: true})
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
        this.peerConnectionLocal = new RTCPeerConnection(this.peerConnectionConfig);
        // set methods on new peer connection object
        this.peerConnectionLocal.addStream(this.localStream)
        this.peerConnectionLocal.onaddstream = e => {
            this.remoteVideo = document.getElementById('remoteVideo');
            this.remoteVideo.src = window.URL.createObjectURL(e.stream);
            //console.log('remote video', this.remoteVideo)
            //console.log('local video', this.localVideo)
        }
        this.peerConnectionLocal.onicecandidate = this.gotIceCandidate;
        //console.log('here we are', this.peerConnectionLocal);
      },

      call() {
        this.peerConnectionLocal.createOffer()
        .then(offer => {
          this.peerConnectionLocal.setLocalDescription(offer);
           this.wsRTC.send(JSON.stringify({'sdp': offer}))
           //console.log('this is our offer', offer, this.peerConnectionLocal)
           })
           .catch(e => { console.log('err', e);})
      },

      gotIceCandidate(e) {

        if(e.candidate != null) {
          this.wsRTC.send(JSON.stringify({'ice': e.candidate}));
        }
      }
    }
  }
</script>