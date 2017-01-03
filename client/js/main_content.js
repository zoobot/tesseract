// Created by Duncan on 12.29.2016
// Methods for main_content.vu
    // var channel, conn;
    // var content = $("#content");
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

}
