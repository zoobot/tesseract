import Vue from 'vue'
import VueResource from 'vue-resource'

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
        throw err;
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
          // Sets token in local storage, this is the only place that
          // can set a token, this ensures a falty token can't be set.
          localStorage.setItem('id_token', data.id);
          cb(data);
        }
      })
      .catch((err) => {
        throw err;
      });
  },

  jwt(context, creds, cb) {
    context.$http.post(`https://127.0.0.1:8443/db/sessions/createsession`, creds)
      .then((res) => {
        let status = JSON.parse(res.status);
        let data = JSON.parse(res.body);
        if (status === 201) {
          this.user.authenticated = true;
          cb(status, data);
        }
      })
      .catch((err) => {
        throw err;
      });
  },

  getJwt(context, query, cb) {
    context.$http.get(`https://127.0.0.1:8443/db/sessions`, {params: {'userid': query}})
      .then((res) => {
        let status = JSON.parse(res.status);
        let data = JSON.parse(res.body);
        if (res.status === 200) {
          this.user.authenticated = true;
          this.user.data = data;
          cb(status, data);
        }
      })
      .catch((err) => {
        throw err;
      })
  },

  getUser(context, query, cb) {
    context.$http.get(`${USER_URL}`, {params: {'id': query}})
      .then((res) => {
        let data = JSON.parse(res.body);
        let status = JSON.parse(res.status);
        if (status === 200) {
          this.user.data = data;
          cb(data);
        }
      })
      .catch((err) => {
        throw err;
      });
  },

  logout() {
    localStorage.removeItem('id_token');
    this.user.authenticated = false;
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
  }
}

