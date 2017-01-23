<template>

    <div id="video">
      <div id="video-container"></div>
      <div class="video-controllers">

        <span v-show="collaborate" @click="start()" id="collaborate">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
          </svg>
        </span>

        <span v-show="connected" @click="call()" id="connect">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M13,15.5V13H7V15.5L3.5,12L7,8.5V11H13V8.5L16.5,12M18,9.5V6A1,1 0 0,0 17,5H3A1,1 0 0,0 2,6V18A1,1 0 0,0 3,19H17A1,1 0 0,0 18,18V14.5L22,18.5V5.5L18,9.5Z" />
          </svg>
        </span>

        <span v-show="end" @click="stop()" id="stop">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M9,9V15H15V9" />
          </svg>
        </span>

        <span v-show="connected" @click="record()" id="record" >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 2A10 10 0 0 0 2 12 10 10 0 0 0 12 22 10 10 0 0 0 22 12 10 10 0 0 0 12 2M12 20C7.6 20 4 16.4 4 12 4 7.6 7.6 4 12 4 16.4 4 20 7.6 20 12 20 16.4 16.4 20 12 20M15 12A3 3 0 0 1 12 15 3 3 0 0 1 9 12 3 3 0 0 1 12 9 3 3 0 0 1 15 12Z"/>
          </svg>
        </span>

        <span v-show="connected" @click="download()" id="download" >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
          </svg>
        </span>

        <span v-show="ourAudio" @click="toggleMute()" id="mute">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
          </svg>
        </span>

        <span v-show="!ourAudio" @click="toggleMute()" id="mute">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
          </svg>
        </span>
      </div>
    </div>

</template>

<script>
  import Methods from '../js/webrtc.js'
  //import Assets from '../assets/images'
  export default {

    mounted() {
      this.signalHandler();
    },

    props: ['wsrtc','uri'],

    data() {
      return {
        ourAudio: true,
        videos:'',
        collaborate: true,
        connected: false,
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

<style scoped>

</style>
