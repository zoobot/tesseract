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
    this.ws.send(this.input);
  },
  // On each keyup counts amount of words on document
  wordCounter() {
    let splitIt = this.input.split(' ');
    // filters out spaces on each 'delete' or 'spacebar' or 'enter' key up then returns the length.
    this.count = splitIt.filter(val => val !== '').length;
  },
  // Function opens websocket with unique ID
  shareChannel() {
    Utils.fetchChannel((response) => {
      this.channel = response.body;
      console.log('this.channel',this.channel);
      this.ws = new WebSocket('ws://' + window.location.host + '/ws/' + this.channel);
      // console.log(this.ws);
      this.ws.onopen = e => {
        // console.log('onopen',e);
      };
      this.ws.onclose = e => {
        // console.log('onclose',e);
      };
      // Whenever we receive a message, update textarea
      this.ws.onmessage = e => {
        // console.log('in this.ws.onmessage',e.data)
        if (e.data !== this.input) {
          this.input = e.data;
          // console.log('this.input',this.input)
          // Needs to be called here as well in order to update word count.
          this.wordCounter();
        }
      };
    });
  }
}
