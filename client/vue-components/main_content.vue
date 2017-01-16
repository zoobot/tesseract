<template>
  <div class="main-content">
    <navbar :user-data="user" :user-logged-in="user.authenticated" :input="input"></navbar>
    <div>
    <!-- Authentication -->
    <div class="auth-area" v-if="!this.user.authenticated">
      <Signin v-if="isLoginShowing" :show-none="showNone"></Signin>
      <Signup v-if="isSignupShowing" :show-none="showNone"></Signup>
      <div class="signup-signin">
        <button class="signup" @click="showSignup()">Signup</button><button class="signin" @click="showSignin()">Signin
        </button>
      </div>
    </div>
    <!-- end Authentication -->
    <ToolBar :word-count="count" :user="user" :user-logged-in="user.authenticated"></ToolBar>
    <!-- area to add live data as text is being added -->
    <div class="content-left">
      <VideoComponent id="video" :wsRTC="wsRTC" :answer="answer"></VideoComponent>
    </div>
    <!-- end live data area -->
    <!-- text field -->
    <div class="content-right">
      <!-- Markdown editor -->
      <!-- Doesn't really compile markdown yet -->
      <div id="editor">
        <textarea id="content" :value="docData.currentDoc.doc" @input="update" @input.ws-send="wsSend" @keyup.delete="wordCounter" @keyup.space="wordCounter" @keyup.enter="wordCounter(true)"></textarea>
      </div>
      <!-- end editor -->
    </div>
    <!-- end text field -->
  </div>
</template>

<script>
  import Navbar from './navbar.vue'
  import ToolBar from './tool_bar.vue'
  import Methods from '../js/main_content.js'
  import VideoComponent from './video_component.vue'
  import Signin from './signin.vue'
  import Signup from './signup.vue'
  import auth from '../js/auth.js'
  import docsave from '../js/docsave.js'
  import Chance from 'chance'

  const chance = new Chance()

  export default {
    created() {
      // get params from URL (if provided)
      let c = this.$route.params.channel;
      // set URI to params or generated 5 char unique.
      let URI = c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5});
      // create websocket with unique address.
      this.ws = new WebSocket(`wss://${window.location.host}/ws/${URI}`);
      //create RTC websocket
      this.wsRTC = new WebSocket(`wss://${window.location.host}/ws/${URI}rtc`);
      // update URL display. I still think we can do this with router somehow :S
      window.history.pushState(window.location.origin, '/', URI);
      // Whenever we receive a message, update textarea
      this.ws.onmessage = e => {
        if (e.data !== this.input) {
          docsave.docData.currentDoc.doc = e.data;
          this.wordCounter();
        }
      };
      let token = auth.getToken();
      // If token exists
      if (token) {
        // Checks if token in computer is valid then gets user resource
        auth.getJwt(this, token);
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
        channel: '',
        // User data stored in auth
        user: auth.user,
        // Doc data stored in docsave
        docData: docsave.docData,
        isLoginShowing: false,
        isSignupShowing: false
      }
    },
    components: {
      ToolBar,
      Navbar,
      VideoComponent,
      Signin,
      Signup
    },
    // Methods are located in js directory
    methods: Methods,
  }
</script>

<style>
  .main-content{
    position: relative;
    width: 100vw;
  }
  .content-right{
    border: 1px solid transparent;
    margin-left: 30vw;
    width: 70vw;
    height: 100vh;
  }
  .content-left{
    position: fixed;
    width: 30vw;
  }
  .signup-signin{
    width: 100%;
    display: table;
    position: absolute;
    top: 2.25em;
  }
  .signup, .signin{
    width: 50%;
    display: table-cell;
    background-color: transparent;
    border: none;
    color: rgb(255, 255, 255);
    outline: none;
  }
  .signup-signin button{
    color: white;
    text-decoration: none;
  }
  .signup-signin button:hover{
    cursor: pointer;
    -moz-box-shadow: 0 0 60px rgb(246, 246, 246);
    -webkit-box-shadow: 0 0 60px rgb(246, 246, 246);
    box-shadow: 0 0 60px rgb(246, 246, 246);
  }
  .auth-area{
    position: fixed;
    width: 25vw;
    height: 4em;
    right: 0;
    top: 0.5em;
  }
  html, body, #editor {
    margin: 0;
    height: 100%;
    color: #333;
    font-family: 'Monaco', courier, monospace;
  }
  textarea, #editor div {
    display: inline-block;
    width: 100%;
    height: 100%;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 20px;
  }
  textarea {
    border: none;
    border-right: 1px solid #ccc;
    resize: none;
    outline: none;
    background-color: #f6f6f6;
    font-size: 14px;
    padding: 20px;
  }
  code {
    color: #f66;
  }
</style>