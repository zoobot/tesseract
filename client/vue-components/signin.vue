<template>
  <div class="panel">
    <div class="panel-body">
      <form @submit.prevent="onSubmit">
        <input type="text" class="form-control" placeholder="Username" v-model="credentials.username">
        <input type="password" class="form-control" placeholder="Password" v-model="credentials.password">
        <input type="submit" class="form-control submit" value="Submit">
        <input type="button" class="form-control submit" value="Back" @click="showNone()">
      </form>
    </div>
    <div class="alert alert-danger" v-if="error">
      <div class="auth-area">
        <Signup :show-none="showNone"></Signup>
      </div>
    </div>
  </div>
</template>

<script>
  import auth from '../js/auth.js'
  import docsave from '../js/docsave.js'
  import Signup from './signup.vue'
  export default {
    data(){
      return {
        credentials: {
          username: '',
          password: ''
        },
        error: false
      }
    },
    components: {
      Signup
    },
    methods: {
      onSubmit() {
        let credentials = {
          username: this.credentials.username.trim(),
          password: this.credentials.password.trim(),
          timestamp: Date.now()
        };
        if (!auth.verifyPassword(credentials.password)) {
          this.error = 'Invalid password!'
          return;
        }
        auth.signin(this, credentials);
      }
    },
    props: ['showNone', 'isLoginShowing']
  }
</script>