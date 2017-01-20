<template>
  <div class="main-content">
    <navbar></navbar>
    <!-- area to add live data as text is being added -->
    <div class="content">
      <div class="content-left">
        <div class="cl-controls">
          <span class="glyphicon glyphicon-file" aria-hidden="true" @click="stats = false"></span>
          <span class="glyphicon glyphicon-stats" aria-hidden="true" @click="stats = true"></span>
        </div>

        <div class="cl-content" :class="[stats ? 'start' : 'end']">
          <statcomponent :quill="quill" v-show="stats"></statcomponent>

          <videocomponent id="video" :wsrtc="wsrtc" :uri="uri" v-show="!stats"></videocomponent>
          <div class="info-con" v-show="!stats">
            <div class="doc-info">
              <div>{{ count }} words</div>
              <div>{{ time }} read</div>
            </div>
            <audiocomponent id="audio" ></audiocomponent>
          </div>
        </div>

      </div>

      <div class="content-right">
        <div id="editor"></div>
      </div>

    </div>

  </div>
</template>

<script>
  import Navbar from './navbar.vue'
  import Methods from '../js/main_content.js'
  import Videocomponent from './video_component.vue'
  import Audiocomponent from './audio_component.vue'
  import {textStats, docSubscribe} from '../js/editor.js'
  import sharedb from 'sharedb/lib/client'
  import richText from 'rich-text'
  import Chance from 'chance'
  import auth from '../js/auth.js'
  import docsave from '../js/docsave.js'
  import editor from '../js/editor.js'
  import statcomponent from './stat_component.vue'


  export default {
    created() {
      let chance = new Chance()
      let c = this.$route.params.channel
      const token = auth.getToken();
      this.uri = c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5})
      //create RTC websocket
      this.wsrtc = new WebSocket(`wss://${window.location.host}/ws/${this.uri}rtc`);
      // update URL display. I still think we can do this with router somehow :S
      window.history.pushState(window.location.origin, '/', this.uri);
      // If token exists
      if (token) {
        // Checks if token in computer is valid then gets user resource
        auth.getJwt(this, token);
      }
    },
    mounted() {
      sharedb.types.register(richText.type)
      let socket = new WebSocket(`ws://${window.location.hostname}:3000/${this.uri}`)
      const connection = new sharedb.Connection(socket)
      // console.log(socket, this.wsrtc)
      // console.log(socket, this.wsrtc)

      // For testing reconnection
      window.disconnect = function() {
        connection.close();
      }
      window.connect = function(uri) {
        let socket = new WebSocket(`ws://${window.location.host}`);
        connection.bindToSocket(socket);
      }
      // Storing doc inside editor for access in other components.
      editor.doc = connection.get('docs', this.uri);
      // New quill
      editor.makeQuill();

      editor.quillOn(this, editor.doc);
      editor.docSubscribe(editor.quill, editor.doc);
      this.quill = editor.quill
    },
    data() {
      return {
        ws: null,
        wsrtc: null,
        channel: '',
        count: 0,
        user: auth.user,
        docData: docsave.docData,
        time: '',
        quill: '',
        uri: '',
        stats: false
      }
    },
    components: {
      Navbar,
      Videocomponent,
      Audiocomponent,
      statcomponent
    },
    // Methods are located in js directory
    methods: Methods
  }
</script>

<style scoped>
.main-content{
  width: 100vw;
}
.active{
  background-color: rgb(24, 24, 24);
  color: #FFF;
}
.disabled{
  background-color: #333;
  color: #FFF;
}
.content{
  display: inline-flex;
  height: 90vh;
  width: 100vw;
}
.cl-controls{
  display: inline-flex;
  width: 100%;
  height: 10%;
}
.cl-controls span{
  display: flex;
  width: 50%;
  justify-content: center;
  align-items: center;
}
.cl-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 90%;
}
.content-right{
  width: 80%;
}
.content-left{
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.start{
  justify-content: flex-start;
}
.end{
  justify-content: flex-end;
}
.doc-info{
  font-size: 0.95em;
  font-weight: 600;
  margin: 1em;
  opacity: 0.35;
}
html, body{
  color: #333;
  font-family: 'Monaco', courier, monospace;
}
.glyphicon{
  color: #000;
  font-size: 1.5em;
}
#editor {
  height: 100%;
  padding: 1em;
}
code {
  color: #f66;
}
</style>
