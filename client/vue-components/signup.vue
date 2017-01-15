<template>
  <div class="panel panel-default">
    <div class="panel-body">
      <transition name="fade" mode="in-out">
        <form @submit="onSubmit($event)">
          <input type="text" class="form-control" placeholder="Username" v-model="credentials.username">
          <input type="password" class="form-control email-password" placeholder="Password" v-model="credentials.password">
          <input type="text" class="form-control email-password" placeholder="Email" v-model="credentials.email">
          <input type="submit" class="form-control submit" value="Signup"><input type="button" class="form-control submit" value="<<Back" @click="showNone()">
        </form>
      </transition>
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
    methods: {
      // Bob1! --> sample username
      // bob@me.com --> sample email
      // FishyTreat1! --> sample password
      onSubmit(e) {
        e.preventDefault();
        let credentials = {
          username: this.credentials.username.trim(),
          email: this.credentials.email.trim(),
          password: this.credentials.password.trim(),
          avatar: this.credentials.avatar,
          membersince: Date.now()
        };
        // if (!auth.verifyUsername(credentials.username)) {
        //   alert('Must contain at least one symbol');
        //   return;
        // }
        // if (!auth.verifyEmail(credentials.email)) {
        //   alert('Invalid email');
        //   return
        // }
        // if (!auth.verifyPassword(credentials.password)) {
        //   alert('Password must be 8 characters with least 1 Alphabet, 1 Number and 1 Special Character')
        // }
        auth.signup(this, credentials, (status) => {
          console.log('signup ->>', status);
          this.showNone();
        });
      }
    },
    props: ['isLoginShowing', 'isSignupShowing', 'showNone'] 
  }
</script>

<style>
  .panel{
    background-color: transparent;
    z-index: 1;
  }
  .panel-body{
    padding: 0;
  }
  .panel, .form-control{
    border-radius: 0px;
    margin: 0;
  }
  .submit, .email-password{
    width: 50%;
  }
  input{
    float: right;
  }
  input[type="text"], input[type="password"], input[type="submit"]{
    background-color: rgb(0, 0, 0);
    color: rgb(246, 246, 246);
  }
</style>