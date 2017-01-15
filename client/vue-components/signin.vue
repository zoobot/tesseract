<template>
  <div class="panel panel-default">
    <div class="panel-body">
      <transition name="fade" mode="in-out">
        <form @on="submit: onSubmit">
          <input type="text" class="form-control" placeholder="Username" v-model="credentials.username">
          <input type="password" class="form-control" placeholder="Password" v-model="credentials.password">
          <input type="button" class="form-control submit" value="Login" @click="onSubmit($event)"><input type="button" class="form-control submit" value="<<Back" @click="showNone()">
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
          password: ''
        },
        error: ''
      }
    },
    methods: {
      onSubmit(e) {
        e.preventDefault();
        let credentials = {
          username: this.credentials.username.trim(),
          password: this.credentials.password.trim(),
          timestamp: Date.now()
        };
        auth.signin(this, credentials, (data) => {
          console.log('signin -->>', data);
          let token = {
            userid: data.id,
            logintime: Date.now(),
            // id_token: 'whatisup' + data.username// Temp!!!
          };
          auth.jwt(this, token, (data) => {
            console.log('signin jwt ->>', data);
          });
        });
      },
    },
    props: ['isLoginShowing', 'isSignupShowing', 'showNone', 'loggedIn'] 
  }
</script>

<style>
  .panel{
    position: fixed;
    top: 0;
    width: 30vw;
    background-color: transparent;
    z-index: 1;
  }
  .panel-body{
    padding: 0;
  }
  .panel, .form-control{
    border-radius: 0px;
    margin: 0;
    border: transparent;
  }
  .submit{
    width: 50%;
  }
  input{
    float: right;
  }
  input[type="text"], input[type="password"], input[type="button"]{
    background-color: rgb(0, 0, 0);
    color: rgb(246, 246, 246);
  }
</style>