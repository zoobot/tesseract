
<template>
  <div class="main-content">
    <navbar></navbar>
    <div class="content">

    <div class="content-left">
<<<<<<< HEAD
      <p>This area is for live data about text</p>
    </div>
    <!-- end live data area -->
    <!-- text field -->
    <div class="content-right float-r">
=======
      <VideoComponent id="video" :wsRTC="wsRTC" :answer="answer"></VideoComponent>
      <div class="doc-info" v-if="count > 0">
        <div>{{ count }} words</div>
        <div>{{ time }} read</div>
      </div>
    </div>

    <div class="content-right">
<<<<<<< HEAD
      <div id="editor"></div>
=======
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
>>>>>>> 724d88a4db4f68b65bf4c6f5fb1500c7b15dd56b
    </div>

  </div>
  </div>
</template>

<script>
  import Navbar from './navbar.vue'
  import Methods from '../js/main_content.js'
<<<<<<< HEAD
=======
  import VideoComponent from './video_component.vue'
<<<<<<< HEAD
=======
  // HTTP calls ect.
>>>>>>> d18605cce8f35fc3b8f68f53381b6ac4d2abe005
>>>>>>> 724d88a4db4f68b65bf4c6f5fb1500c7b15dd56b
  import Utils from '../js/utils.js'
  import {textStats, docSubscribe} from '../js/editor.js'
  import sharedb from 'sharedb/lib/client'
  import richText from 'rich-text'
  import Quill from 'quill'
  import Chance from 'chance'

  export default {
    created() {
<<<<<<< HEAD
      let chance = new Chance()
      let c = this.$route.params.channel
      this.URI = c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5})
=======
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
>>>>>>> 724d88a4db4f68b65bf4c6f5fb1500c7b15dd56b

      //create RTC websocket
      this.wsRTC = new WebSocket(`wss://${window.location.host}/ws/${this.URI}rtc`);

      // update URL display. I still think we can do this with router somehow :S
<<<<<<< HEAD
      window.history.pushState(window.location.origin, '/', this.URI);
    },
    mounted() {
      sharedb.types.register(richText.type)
      let socket = new WebSocket(`ws://${window.location.hostname}:3000/${this.URI}`)
      const connection = new sharedb.Connection(socket)
      // For testing reconnection
      window.disconnect = function() {
        connection.close();
=======
      window.history.pushState(window.location.origin, '/', URI);

>>>>>>> d18605cce8f35fc3b8f68f53381b6ac4d2abe005
      // Whenever we receive a message, update textarea
      this.ws.onmessage = e => {
        if (e.data !== this.input) {
          this.input = e.data;
          this.wordCounter();
        }
>>>>>>> 724d88a4db4f68b65bf4c6f5fb1500c7b15dd56b
      }
      window.connect = function(URI) {
        let socket = new WebSocket(`ws://${window.location.host}`);
        connection.bindToSocket(socket);
      }
      const doc = connection.get('docs', this.URI);
      this.quill = new Quill('#editor', {
        placeholder: 'Filthy animals.',
        theme: 'bubble'
      })
      this.quill.on('text-change', () => {
        let text = this.quill.getText()
        let stats = textStats(text)
        this.time = stats.display
        this.count = stats.length
      })
      docSubscribe(this.quill, doc)
    },
    data() {
      return {
        ws: null,
        wsRTC: null,
        answer:'',
        channel: '',
        count: 0,
        time: '',
        quill: '',
        URI: ''
      }
    },
    components: {
      Navbar,
      VideoComponent
    },
    // Methods are located in js directory
    methods: Methods,
  }
</script>

<<<<<<< HEAD
<style scoped>
.main-content{
  width: 100vw;
}
.content{
  display: inline-flex;
  height: 87vh;
  width: 100vw;
}
.content-right{
  width: 80%;
}
.content-left{
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.doc-info{
  font-size: 0.95em;
  font-weight: 600;
  margin: 0.75em;
  opacity: 0.35;
}
html, body{
  color: #333;
  font-family: 'Monaco', courier, monospace;
}
#editor {
  height: 100%;
}
code {
  color: #f66;
}
</style>
=======
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
>>>>>>> 724d88a4db4f68b65bf4c6f5fb1500c7b15dd56b
