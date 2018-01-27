<template>
  <div id="video-comp" class="video-comp">
    <div class="nav" >
      <span class="video-icons">

        <img :src="'/client/assets/images/video-start.svg'" @click="start()"  />
        <img :src="'/client/assets/images/video-connected.svg'" @click="connect()"  />
        <img :src="'/client/assets/images/video-stop.svg'" @click="stop()"  />
        <img :src="'/client/assets/images/video-mute.svg'" @click="mute()"  />
        <img :src="'/client/assets/images/video-record.svg'" @click="record()"  />
        <img :src="'/client/assets/images/video-download.svg'" @click="download()"  />
      </span>
    </div>

    <div id="video-container" class="video-container"></div>
  </div>
</template>



<script>
  import Methods from '../js/webrtc_tesseract.js'
  //import Assets from '../assets/images'
  export default {

    mounted() {
      // this.start()
      this.signalHandler();

    },

    props: ['wsrtc','uri'],

    data() {
      return {
        // icons: [
        // {
        //   id: 'start',
        //   img:'/client/assets/images/video-start.svg',
        //   toggler: this.start()
        // }, {
        //   id: 'connect',
        //   img:'/client/assets/images/video-connected.svg',
        //   toggler: this.connect()
        // }, {
        //   id: 'stop',
        //   img:'/client/assets/images/videostop.svg',
        //   toggler: this.stop()
        // }, {
        //  id: 'record',
        //  img:'/client/assets/images/video-record.svg',
        // toggler: this.record()
        // }, {
        //   id: 'mute',
        //   img:'/client/assets/images/video-mute.svg',
        //   toggler: this.mute()
        // }],
        ourAudio: true,
        videos:'',
        collaborate: true,
        connected: true,
        end: false,
        record: false,
        download: false,
        ourAnswer:'',
        otherSDP:'',
        iceCandidates:[],
        pc: null,
        localStream:'',
        theRecorder: null,
        recordedChuck: [],
        peerConnectionConfig: {'iceServers': [{'url': 'stun:stun.l.google.com:19305'}, {'url': 'stun:stun.services.mozilla.com'}]},

      }
    },

    methods: Methods

  }
</script>
