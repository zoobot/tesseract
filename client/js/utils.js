// Created by Duncan on 12.29.2016
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);
// Temp server address. Connnected to a mongodb for testing.
// Post(send), Put(update), and Delete(remove) data...
/*
  {
    userName: 'Sally',
    email: 'sally@me.com',
    password: '1234435wefdsgg',
    saved: [some.txt, that.txt]
  }
*/
// Get(fetch) takes no query receives all data
// **send an empty object to delete to delete all data**

const url = 'http://127.0.0.1:2727';

module.exports = {
  // fetchChannel(cb) {
  //   Vue.http.get('/getUrl')
  //   .then((res) => {
  //     cb(res)
  //   }).catch((res) => {
  //     throw res;
  //   });
  // },
  // Fetches data from database
  fetch(param, cb) {
    // Searches based on params passed in, param is an array --> ex ['_id', '12345']. Empty array will return entire database.
    // Can search for any valid property.
    // If found response will be all user data and response code 200.
    Vue.http.get(url + '/db?' + param.join('='))
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  },
  send(data, cb) {
    // Send full body (like above), will search for userName before adding.
    // If user is found will respond with all user data and status code 200.
    // If not found will add user and respond with user id to add to session or cookie and status code 201.
    Vue.http.post(url + '/db', JSON.stringify(data))
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  },
  update(data, cb) {
    // Send full body with new data plus an _id property with id stored in cookie or session.
    // Will resond with updated data and response code 201.
    Vue.http.put(url + '/db', JSON.stringify(data))
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  },
  remove(data, cb) {
    // Send body with at least _id property to delete a single user.
    // Response will be a status code of 201.
    // Be warned an empty body object will delete whole db, this is like this just for development purposes, will remove before the end.
    Vue.http.delete(url + '/db', JSON.stringify(data))
    .then((res) => {
      cb(res);
    }).catch((res) => {
      throw res;
    });
  }
}
