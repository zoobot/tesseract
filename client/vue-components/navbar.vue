<!-- Created by Duncan on 12.28.2016 -->
<template>
  <nav class="navbar navbar-fixed-top">
    <div class="nav-left">
    </div>
    <div class="title">
      <span>Untitled</span>
    </div>
    <div class="avatar-area">

    </div>
  </nav>
</template>

<script>
  import Avatar from 'vue-avatar-component'
  import Methods from '../js/navbar.js'
  // HTTP calls ect.
  import Utils from '../js/utils.js'
  export default {
    created() {},
    components: { Avatar },
    // Methods are located in js directory
    methods: Methods
  }
</script>

<style>
  .navbar {
    display: inline-flex;
    background-color: rgb(24, 24, 24);
    height: 13vh;
    margin: 0;
    border: none;
  }
  .nav-left {
    display: flex;
    width: 30vw;
  }
  .title{
    display: flex;
    width: 50vw;
    color: #FFF;
    align-items: center;
    justify-content: center;
  }
  .avatar-area{
    padding-right: 2em;
  }
  .glyphicon{
    color: rgb(255, 255, 255);
  }
<<<<<<< HEAD
=======
  .left-nav{
    position: relative;
    display: table-cell;
    height: 100%;
    width: 30vw;
  }
>>>>>>> d18605cce8f35fc3b8f68f53381b6ac4d2abe005
</style>
