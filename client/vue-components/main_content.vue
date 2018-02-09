<template>
  <!-- <img src="../assets/images/tesseract-background.jpg" /> -->
  <div class="container">
    <div class="nav">
      <div class="headline">talk<br>talk</div>
        <span class="tesseract-icon" v-bind:class="[this.isActive ? !this.activeClass : '', errorClass]">
          <img :src="'/client/assets/images/tesseract.svg'"  />
        </span>
    </div>

    <videocomponent id="video" :wsrtc="wsrtc" :uri="uri" ></videocomponent>

  </div>
</template>

<script>
  // import Methods from '../js/main_content.js'
  import Videocomponent from './video_component.vue'
  import Chance from 'chance'


  export default {
    created() {
      let chance = new Chance()
      let c = this.$route.params.channel
      this.uri = c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5})
      //create RTC websocket
      this.wsrtc = new WebSocket(`wss://${window.location.host}/ws/${this.uri}rtc`);
      // update URL display. I still think we can do this with router somehow :S
      window.history.pushState(window.location.origin, '/', this.uri);
    },
    mounted() {
    },
    data() {
      return {
        ws: null,
        wsrtc: null,
        channel: '',
        count: 0,
        time: '',
        uri: '',
      }
    },
    components: {
      Videocomponent
    }
  }
</script>