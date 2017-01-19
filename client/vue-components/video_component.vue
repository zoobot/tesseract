<template>

    <div id="video">
      <div id="video-container"></div>
      <button v-show="collaborate" @click="start()" id="collaborate" >collaborate</button>
      <button v-show="connected" @click="call()" id="connect">click to connect</button>
      <button v-show="!ourAudio" @click="toggleMute()" id="mute">unmute yourself</button>
      <button v-show="ourAudio" @click="toggleMute()" id="mute">mute yourself</button>
      <button v-show="stopped" @click="stop()" id="stop">stop sharing</button>
      <button @click="record()" id="record" >record yourself</button>
      <button @click="download()" id="download" >download recording</button>
    </div>

</template>

<script>
  import Methods from '../js/webrtc.js'
  export default {

    mounted() {
      this.signalHandler();
    },

    props: ['wsrtc','uri'],

    data() {
      return {
        stopped:false,
        ourAudio: true,
        videos:'',
        collaborate: true,
        connected: false,
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
