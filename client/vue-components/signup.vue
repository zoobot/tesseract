<template>
  <div class="panel">
    <div class="panel-body">
      <form @submit.prevent="onSubmit">
        <input type="text" class="form-control" placeholder="Username" v-model="credentials.username">
        <input type="text" class="form-control" placeholder="Email" v-model="credentials.email">
        <input type="password" class="form-control" placeholder="Password" v-model="credentials.password">
        <input type="submit" class="form-control submit" value="Submit">
        <input type="button" class="form-control submit" value="Back" @click="showNone()">
      </form>
      <div class="alert alert-danger" v-if="error"> {{ error }} </div>
    </div>
  </div>
</template>

<script>
  import auth from '../js/auth.js'

  export default {
    data(){
      return {
        credentials: {
          username: '',
          email: '',
          password: '',
          avatar: ''//for future
        },
        error: '',
        loggingin: true
      }
    },
    created() {
    },
    methods: {
      // Bob1! --> sample username
      // bob@me.com --> sample email
      // FishyTreat1! --> sample password
      onSubmit() {
        let credentials = {
          username: this.credentials.username.trim(),
          email: this.credentials.email.trim(),
          password: this.credentials.password.trim(),
          avatar: this.credentials.avatar,
          membersince: Date.now()
        };

        if (!auth.verifyEmail(credentials.email)) {
          this.error = 'Invalid email';
          return
        }
        if (!auth.verifyPassword(credentials.password)) {
          this.error = 'Password must be 8 characters with least 1 Alphabet, 1 Number and 1 Special Character'
          return
        }
        auth.signup(this, credentials, status => this.showNone());
      }
    },
    props: ['showNone'] 
  }
</script>