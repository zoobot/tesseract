import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

const USER_URL = 'https://127.0.0.1:8443/db/user';
const eValidate = require('email-validator');

Vue.use(VueResource);

export default {
  // user object will let us check if the user is authenticate and is where user data will be stored.
  user: {
    authenticated: false,
    data: {}
  },
  signup(context, creds, cb) {
    context.$http.post(`${USER_URL}/signup`, creds)
      .then((res) => {
        let data = JSON.parse(res.body);
        let status = JSON.parse(res.status);
        if (status === 200) {
          cb(status);
        } else if (status === 201) {
          cb(status);
        }
      })
      .catch((err) => {
        context.error = 'Oops something went wrong!';
      });
  },

  signin(context, creds, cb) {
    context.$http.post(`${USER_URL}/signin`, creds)
      .then((res) => {
        let data = JSON.parse(res.body);
        let status = JSON.parse(res.status);
        if (status === 404) {
          cb(status);
        } else if (status === 200) {
          this.user.data = data;
          this.user.authenticated = true;
          // Sets token in local storage, this is the only place that
          // can set a token, this ensures a falty token can't be set.
          localStorage.setItem('id_token', data.id);
          cb(data);
        }
      })
      .catch((err) => {
        context.error = 'Invalid user credentials!';
      });
  },

  jwt(context, id) {
    let token = {
      userid: id,
      logintime: Date.now(),
      // id_token: 'whatisup' + data.username// Temp!!!
    };

    context.$http.post(`https://127.0.0.1:8443/db/sessions/createsession`, token)
      .then((res) => {
        let status = JSON.parse(res.status);
        let data = JSON.parse(res.body);
      })
      .catch((err) => {
        context.error = err;
      });
  },

  getJwt(context, query, cb) {
    context.$http.get(`https://127.0.0.1:8443/db/sessions`, {params: {'userid': query}})
      .then((res) => {
        let status = JSON.parse(res.status);
        let data = JSON.parse(res.body);
        if (res.status === 200) {
          cb(data[0].userid);
        }
      })
      .catch((err) => {
        throw err;
      })
  },

  getUser(context, query) {
    context.$http.get(`${USER_URL}`, {params: {'id': query}})
      .then((res) => {
        let data = JSON.parse(res.body);
        let status = JSON.parse(res.status);
        this.user.data = data[0];
        this.user.authenticated = true;
      })
      .catch((err) => {
        throw err;
      });
  },

  logout() {
    localStorage.removeItem('id_token');
    this.user.authenticated = false;
    this.user.data = {};
  },

  // The object to be passed as a body for authentication requests
  getAuthHeader() {
    return {
      UserId: this.getToken(),
      logintime: Date.now()
    }
  },

  getToken() {
    return localStorage.getItem('id_token');
  },

  // Helpers,
  verifyEmail(email) {
    // Only checking format currently. Will implement confirmation email later.
    return eValidate.validate(email);
  },

  verifyUsername(un) {
    // Must contain at least one symbol
    return un.match(/^[A-Za-z0-9]+$/) ? false : true;
  },

  verifyPassword(pw) {
    // Minimum 8 characters at least 1 Alphabet, 1 Number and 1 Special Character:
    // FishyTreat1!
    return pw.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/) ? true : false;
  },

  getUserData() {
    return this.user;
  }
}

