<template>
  <div class="main-content">
    <navbar :user-data="user" :user-logged-in="user.authenticated"></navbar>
    <div>
    <!-- area to add live data as text is being added -->
     <div class="content-left">
      <videocomponent id="video" :wsrtc="wsRTC" :uri="URI"></videocomponent>

      <div class="doc-info" v-if="count > 0">
        <div>{{ count }} words</div>
        <div>{{ time }} read</div>
      </div>
    </div>

    <div class="content-right">
      <div id="editor"></div>
    </div>

  </div>
</template>

<script>
  import Navbar from './navbar.vue'
  import Methods from '../js/main_content.js'
  import Videocomponent from './video_component.vue'
  import Utils from '../js/utils.js'
  import {textStats, docSubscribe} from '../js/editor.js'
  import sharedb from 'sharedb/lib/client'
  import richText from 'rich-text'
  import Quill from 'quill'
  import Chance from 'chance'
  import auth from '../js/auth.js'
  import docsave from '../js/docsave.js'

  export default {
    created() {
      let chance = new Chance()
      let c = this.$route.params.channel
      this.URI = c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5})
      //create RTC websocket
      this.wsRTC = new WebSocket(`wss://${window.location.host}/ws/${this.URI}rtc`);
      // update URL display. I still think we can do this with router somehow :S
      window.history.pushState(window.location.origin, '/', this.URI);
      let token = auth.getToken();
      // If token exists
      if (token) {
        // Checks if token in computer is valid then gets user resource
        auth.getJwt(this, token);
      }
    },
    mounted() {
      sharedb.types.register(richText.type)
      let socket = new WebSocket(`ws://${window.location.hostname}:3000/${this.URI}`)
      const connection = new sharedb.Connection(socket)

      // console.log(socket, this.wsRTC)
      // For testing reconnection
      window.disconnect = function() {
        connection.close();
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
        // Updating current doc
        docsave.docData.currentDoc.doc = this.quill.getText();
      })
      docSubscribe(this.quill, doc)
    },
    data() {
      return {
        ws: null,
        wsRTC: null,
        wsScreen: null,
        channel: '',
        count: 0,
        // User data stored in auth
        user: auth.user,
        // Doc data stored in docsave
        docData: docsave.docData,
        time: '',
        quill: '',
        URI: ''
      }
    },
    components: {
      Navbar,
      Videocomponent,
    },
    // Methods are located in js directory
    methods: Methods,
  }
</script>

<style scoped>
.main-content{
  width: 100vw;
  margin-top: 2em;
}
.content{
  display: inline-flex;
  height: 87vh;
  width: 100vw;
}
.content-right{
  width: 80%;
  display: inline-block;
  float: right;
}
.content-left{
  width: 20%;
  display: inline-block;
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

