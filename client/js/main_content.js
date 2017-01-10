// Created by Duncan on 12.29.2016
// Methods for main_content.vu
// HTTP calls ect.
import Utils from '../js/utils.js'

module.exports = {
  // Function adds each charactor to input
  update(e) {
    this.input = e.target.value
  },
  wsSend() {
      // get params from URL (if provided)
      let c = this.$route.params.channel;
      // set URI to params or generated 5 char unique.
      let URI = c !== undefined && /^\w{5}$/.test(c) ? c : chance.word({length: 5});
      // create websocket with unique address.
      this.ws = new WebSocket(`ws://${window.location.host}/ws/${URI}`);
      // update URL display. I still think we can do this with router somehow :S
      window.history.pushState(window.location.origin, '/', URI);
      // Whenever we receive a message, update textarea
      this.ws.onmessage = e => {
        if (e.data !== this.input) {
          this.input = e.data;
          this.wordCounter();
        }
      }
  },
  // On each keyup counts amount of words on document
  wordCounter() {
    let splitIt = this.input.split(' ');
    // filters out spaces on each 'delete' or 'spacebar' or 'enter' key up then returns the length.
    this.count = splitIt.filter(val => val !== '').length;
  },
  // Function opens websocket with unique ID
  shareChannel(cb) {
    Utils.fetchChannel((response) => {
      this.ws = new WebSocket('ws://' + window.location.host + '/ws/' + response.body);
      // Whenever we receive a message, update textarea
      this.ws.onmessage = e => {
        // console.log('in this.ws.onmessage',e.data)
        if (e.data !== this.input) {
          this.input = e.data;
          this.wordCounter();
        }
        // Callback changes the url in the browser
        cb(response.body);
      };
    });
  }
}
