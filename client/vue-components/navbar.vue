<template>
  <nav class="navbar navbar-fixed-top">
    <div class="left-nav">
    </div>
    <div class="title" v-if="this.user.authenticated">
      <p> {{ docs.currentDoc || 'untitled' }} </p>
    </div>
    <div class="right-nav" v-if="this.user.authenticated">
      <!-- can change fullname to image.//size throws an error however it is working?! -->
      <avatar class="user-details" v-bind:fullname="user.data.username" color="rgb(0, 0, 0)" size="40"></avatar>

      <div class="user-stuff panel-body">

        <div class="signout-container panel-heading">
          <button class="signout fixed-top" @click="logout()">Signout</button>
        </div>

        <div class="saved">
          <div class="saved-docs">
              <button v-for="item in docs" :id="item.id" @click="uploadDoc($event.target.id)">
                {{ item.name }}
              </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  import Avatar from 'vue-avatar-component'
  import Methods from '../js/navbar.js'
  import auth from '../js/auth.js'
  import docsave from '../js/docsave.js'

  export default {
    created() {
    },
    data() {
      return {
        user: auth.user,
        docs: docsave.docData.docs
      }
    },
    components: {
      Avatar
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
  .avatar{
    cursor: pointer;
  }
  .glyphicon{
    color: rgb(255, 255, 255);
  }
  .user-stuff{border: 1px solid white;
    position: fixed;
    top: 0;
    right: 0;
    width: 30vw;
    height: 8em;
    background-color: transparent;
    overflow: auto;
  }
  .saved{border: 1px solid white;
    width: 100%;
    padding-top: 3em;
    min-height: 100%;
    overflow: scroll;
  }
  .signout-container{
    position: fixed;
    top: 0;
    width: 30vw;
  }
  .signout, .saved-docs button{
    background-color: rgb(24, 24, 24);
  }
</style>
