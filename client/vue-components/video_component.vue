<template>
  <div id="video-comp" class="video-comp">
    <div class="nav" >
      <span class="video-icons">

        <img :src="'/client/assets/images/video-start.svg'" @click="start()"  class="video-icon"/>
        <img :src="'/client/assets/images/video-connected.svg'" @click="connect()" class="video-icon"/>
        <img :src="'/client/assets/images/video-stop.svg'" @click="stop()"  class="video-icon"/>
        <img :src="'/client/assets/images/video-mute.svg'" @click="mute()"  class="video-icon"/>
        <img :src="'/client/assets/images/video-record.svg'" @click="record()"  class="video-icon"/>
        <img :src="'/client/assets/images/video-download.svg'" @click="download()"  class="video-icon"/>

      </span>
    </div>

    <div class="video-container">

    <video id="pc1" autoplay class="video-local-connected" v-bind:class="[this.isActive ? this.activeClass : '', errorClass]"></video>
    <video id="pc2" autoplay class="video-remote-connected"></video>
    </div>
  </div>
</template>



<script>
  import Methods from '../js/webrtc_tesseract.js'
  //import Assets from '../assets/images'
  export default {

    mounted() {
      this.signalHandler()
      // this.starter();

    },

    props: ['wsrtc','uri'],

    data() {
      return {
        pc1:null,
        pc2:null,
        isActive: '',
        activeClass: 'active',
        errorClass: 'text-danger',
        ourAudio: true,
        videos:'',
        collaborate: true,
        connected: false,
        end: false,
        record: false,
        download: false,
        newOffer:'',
        newAnswer:'',
        // newOfferAnswer:'',
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
