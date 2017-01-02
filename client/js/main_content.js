// Created by Duncan on 12.29.2016
// Methods for main_content.vu
    // var channel, conn;
    // var content = $("#content");
module.exports = {
  // Function adds each charactor to input
  update(e) {
    this.input = e.target.value
    // this.socket(e);
    console.log('this.input',this.input)
    // this.onMessage(e);
    // this.connector();
    this.ws.send(this.input);
    // this.ws.onmessage = function(e) {
    //     console.log('in this.ws.onmessage',e.data)
    //     if (e.data != this.input) {

    //       this.input = e.data;
    //       console.log('this.input',this.input)
    //     }
    // };


  },


  // this.ws.onmessage(e) {
  //   console.log('in this.ws.onmessage',e.data)
  //   if (e.data != this.input) {
  //     this.input = e.data;
  //   }

  // },

  // channelSetup(response) {
  //   console.log('getUrl datas!:', response);
  //   channel = response;
  //   console.log(channel)
  //   conn = new WebSocket('ws://' + window.location.host + '/ws/' + channel);
  //   console.log('conn',conn)
  //   this.mychan = conn

  //   // Textarea is editable only when socket is opened.
  //   conn.onopen = function(e) {
  //     console.log('onopen',e);
  //     content.attr("disabled", false);
  //   };

  //   conn.onclose = function(e) {
  //     console.log('onclose',e);
  //     content.attr("disabled", true);
  //   };

  //   // Whenever we receive a message, update textarea
  //   conn.onmessage = function(e) {
  //     console.log('in conn.onmessage',e.data)
  //     if (e.data != content.val()) {
  //       console.log('in if',e.target.value)
  //     //  e.data = "test";
  //       //content.val(e.data);
  //       content.input = e.target.value
  //     }
  //   }
  // },
  // On each keyup counts amount of words on document
  wordCounter() {
    let splitIt = this.input.split(' ');
    // filters out spaces on each 'delete' or 'spacebar' or 'enter' key up then returns the length.
    this.count = splitIt.filter(val => val !== '').length;
  },

}