<!-- Created by Duncan on 12.28.2016 -->
<template>
  <div class="main-content">
    <navbar></navbar>
    <div>
    <ToolBar :word-count="count"></ToolBar>
    <!-- area to add live data as text is being added -->
    <div class="content-left">
<<<<<<< HEAD
      <p>This area is for live data about text</p>
    </div>
    <!-- end live data area -->
    <!-- text field -->
    <div class="content-right float-r">
=======
      <VideoComponent id="video" :wsRTC="wsRTC" :answer="answer"></VideoComponent>
    </div>
    <!-- end live data area -->
    <!-- text field -->
    <div class="content-right">
      <!-- Markdown editor -->
      <!-- Doesn't really compile markdown yet -->
>>>>>>> d18605cce8f35fc3b8f68f53381b6ac4d2abe005
      <div id="editor">
        <textarea id="content"
        :value="input"
        @input="update"
        @input.ws-send="wsSend"
        @keyup.delete="wordCounter"
        @keyup.space="wordCounter"
        @keyup.enter="wordCounter(true)">
      </textarea>
      </div>
      <!-- end editor -->
    </div>
    <!-- end text field -->
  </div>
  </div>
</template>

<script>
  import Navbar from './navbar.vue'
  import ToolBar from './tool_bar.vue'
  import Methods from '../js/main_content.js'
<<<<<<< HEAD
=======
  import VideoComponent from './video_component.vue'
  // HTTP calls ect.
>>>>>>> d18605cce8f35fc3b8f68f53381b6ac4d2abe005
  import Utils from '../js/utils.js'
  import Chance from 'chance'
  const chance = new Chance()

  export default {
    created() {
      // get params from URL (if provided)
      let c = this.$route.params.channel;
<<<<<<< HEAD
      // set URI to params or generated 5 char unique.
      let URI = c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5});
      // create websocket with unique address.
      this.ws = new WebSocket(`ws://${window.location.host}/ws/${URI}`);
      // update URL display. I still think we can do this with router somehow :S
      window.history.pushState(window.location.origin, '/', URI);
=======

      // set URI to params or generated 5 char unique.
      let URI = c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5});

      // create websocket with unique address.
      this.ws = new WebSocket(`wss://${window.location.host}/ws/${URI}`);

      //create RTC websocket
      this.wsRTC = new WebSocket(`wss://${window.location.host}/ws/${URI}rtc`);

      // update URL display. I still think we can do this with router somehow :S
      window.history.pushState(window.location.origin, '/', URI);

>>>>>>> d18605cce8f35fc3b8f68f53381b6ac4d2abe005
      // Whenever we receive a message, update textarea
      this.ws.onmessage = e => {
        if (e.data !== this.input) {
          this.input = e.data;
          this.wordCounter();
        }
      }

    },

    data() {
      return {
        // URI: c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5}),
        ws: null,
        wsRTC: null,
        answer:'',
        input: '',
        channel: '',
        count: 0,
        channel: ''
      }
    },
    components: {
      ToolBar,
      Navbar,
      VideoComponent
    },
    // Methods are located in js directory
    methods: Methods,
  }
</script>

<style>
  .main-content{
    width: 100vw;
  }
  .content-right{
    width: 70vw;
    height: 87vh;
  }
  .content-left{
    position: fixed;
    width: 30vw;
  }
  html, body{
    margin: 0;
    color: #333;
    font-family: 'Monaco', courier, monospace;
  }
  #editor {
    height: 100%
  }
  textarea, #editor div {
    width: 100%;
    height: 100%;
    vertical-align: top;
    padding: 0 20px;
  }
  textarea {
    border: none;
    resize: none;
    outline: none;
    font-size: 1em;
    padding: 20px;
  }
  code {
    color: #f66;
  }
</style>