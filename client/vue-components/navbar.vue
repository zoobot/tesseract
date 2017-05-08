
<template>
  <nav class="navbar navbar-fixed-top">

    <div class="left-nav">
      <div class="logo"><img src="/client/assets/images/logo.svg" ></div>
    </div>

    <div class="title">
      <p v-if="this.user.authenticated"> {{ this.docData.currentDoc.name || 'New' }} </p>
    </div>

    <!-- Authentication -->
    <!-- If user not authenticated signin -->
    <div class="auth-area" v-if="!this.user.authenticated">
     <Signin v-if="isLoginShowing" :show-none="showNone"></Signin>
     <div class="user-details" @click="showSignin()"> # </div>
    </div>
    <!-- If user authenticated show username and controls -->
     <div class="right-nav" v-if="this.user.authenticated">
      <div class="user-details" @click="showControls()"> {{ this.user }} </div>
      <div> {{console.log(this.user.data)}}</div>
      <!-- <div class="user-details" @click="showControls()"> {{ user.data.username[0] }} </div> -->

       <!-- hidden control panel -->
       <div class="user-stuff panel-body" v-if="this.showControl">

         <!-- logout button -->
         <div class="signout-container panel-heading">
           <button class="control-buttons signout fixed-top" @click="logout()">Signout</button>
           <button class="control-buttons" @click="showControls()">Close</button>
         </div>
         <!-- end logout button -->

         <!-- saved documents list -->
         <div class="saved">
           <div class="saved-docs">
               <button v-for="item in docData.docs" :id="item.id" @click="uploadDoc($event.target.id)">
                 {{ item.name }}
               </button>
           </div>
           <!-- Save buttons -->
           <div class="save" v-if="this.user.authenticated">
             <button @click="swapSaveAs()" v-if="!savingAs">Save As</button>
             <form v-if="savingAs" @submit.prevent="saveAs">
               <input class="saving-as" type="input" name="save-as" v-model="docName" placeholder="Chapter-9">
             </form>
             <button @click="save()" v-if="docData.currentDoc.name">Save</button>
             <button @click="deleteDoc()" v-if="docData.currentDoc.name">Delete</button>
             <button @click="newDoc()">New</button>
           </div>
           <!-- end Save buttons -->
           <!-- end saved documents list -->
         </div>
         <!-- end hidden control panel -->
         <!-- end if user is authenticated -->
      </div>
      <!-- end authentication area -->
    </div>
  </nav>
</template>

<script>
  import Methods from '../js/navbar.js'
  import auth from '../js/auth.js'
  import docsave from '../js/docsave.js'
  import Signin from './signin.vue'
  import Signup from './signup.vue'
  export default {
    created() {
    },
    data() {
      return {
        user: auth.user,
        docData: docsave.docData,
        showControl: false,
        isLoginShowing: false,
        isSignupShowing: false,
        savingAs: false,
        docName: ''
      }
    },
    components: {
      Signin,
      Signup,
    },
    props: ['stats'],
    // Methods are located in js directory
    methods: Methods
  }
</script>
