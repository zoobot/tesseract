<template>
  <nav class="navbar navbar-fixed-top">
    <div class="left-nav">
    </div>
    <div class="title">
      <p>Untitled</p>
    </div>
    <div class="auth-area">
      <Signin v-if="isLoginShowing" :show-none="showNone" :is-login-showing="isLoginShowing" :is-signup-showing="isSignupShowing" :logged-in="loggedIn"></Signin>
      <Signup v-if="isSignupShowing" :show-none="showNone" :is-login-showing="isLoginShowing" :is-signup-showing="isSignupShowing"></Signup>
    </div>
    <div class="right-nav">
      <!-- can change fullname to image.//size throws an error however it is working?! -->
      <transition>
        <avatar class="user-details" v-bind:fullname="userData.username" color="rgb(0, 0, 0)" size="20" v-if="loggedIn"></avatar>
        <div class="user-details auth-options" v-if="!loggedIn"><a @click="showSignin()">Signin</a>/<a @click="showSignup()">Signup</a></div>
      </transition>
    </div>
  </nav>
</template>

<script>
  import Avatar from 'vue-avatar-component'
  import Signin from './signin.vue'
  import Signup from './signup.vue'
  import Methods from '../js/navbar.js'
  import auth from '../js/auth.js'

  // HTTP calls ect.
  import Utils from '../js/utils.js'
  export default {
    created() {
      this.$on('authenticated', () => {
        console.log('navbar heard!')
      });
    },
    data() {
      return {
        isLoginShowing: false,
        isSignupShowing: false,
        loggedIn: false
      }
    },
    components: {
      Avatar,
      Signin,
      Signup
    },
    // Methods are located in js directory
    methods: Methods
  }
</script>

<style>
  .navbar{
    color: white;
    display: table;
    z-index: 0;
    background-color: rgb(24, 24, 24);
    height: 8em;
    width: 100vw;
    border: transparent;
  }
  .title{
    color: rgb(255, 255, 255);
    font-weight: normal;
    text-align: center;
    vertical-align: middle;
  }
  .title, .right-nav{
    text-align: center;
    vertical-align: middle;
  }
  .left-nav, .right-nav, .title{
    display: table-cell;
    height: 100%;
    width: 33.33vw;
  }
  .user-details{
    float: right;
  }
  .auth-area{
    position: fixed;
    width: 25vw;
    height: 4em;
    right: 0;
    top: 0.5em;
    text-align: center;
    text-align: right;
  }
  .avatar{
    cursor: pointer;
  }
  .glyphicon{
    color: rgb(255, 255, 255);
  }
  .auth-options a{
    color: white;
    text-decoration: none;
  }
  .auth-options a:hover{
    cursor: pointer;
    -moz-box-shadow: 0 0 60px rgb(246, 246, 246);
    -webkit-box-shadow: 0 0 60px rgb(246, 246, 246);
    box-shadow: 0 0 60px rgb(246, 246, 246);
  }
</style>
