module.exports = {
  async starter() {
    await this.wsrtc.send(JSON.stringify({'type': 'join' }))
    await this.wsrtc.send(JSON.stringify({'type': 'joinUp' }))



      //this tells the getUserMedia what data to grab and set in the MediaStream object that the method produces,
      //which is then used in the success callback on the MediaStream object that contains the media stream
    this.pc1 = await new RTCPeerConnection(this.peerConnectionConfig)
    this.pc2 = await new RTCPeerConnection(this.peerConnectionConfig)

    console.log('peers', this.pc1, this.pc2)


    let icechange = (label, evt) =>
          console.log(`${label} ICE ${evt.target.iceConnectionState}`)
    this.pc1.oniceconnectionstatechange = icechange.bind(null, 'pc1')
    this.pc2.oniceconnectionstatechange = icechange.bind(null, 'pc2')
        //   // wire up ice candidates. Each candidate fires onicecandidate with a candidate,
        //   // so take it and give it to the other connection via addIceCandidate
    let onicecandidate = (pc, e) => e.candidate && pc.addIceCandidate(e.candidate)
    this.pc1.onicecandidate = onicecandidate.bind(null, this.pc2)
    this.pc2.onicecandidate = onicecandidate.bind(null, this.pc1)

    //   // wire up onaddstream events. when remote stream connects, the event will
    //   // fire so you can attach the stream to the DOM
    let onaddstream = (sel, e) => document.getElementById(sel).srcObject = e.stream
    this.pc1.onaddstream = onaddstream.bind(null, 'pc2')
    this.pc2.onaddstream = onaddstream.bind(null, 'pc1')

    // //   // Get a stream and add it to the connections
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    stream.catch(err => console.error('Err getting media', err))
    this.pc1.addStream(await stream)
    this.pc2.addStream(await stream)

    async addStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        this.pc1.addStream(await stream)
        this.pc2.addStream(await stream)
      } catch(err) {
        console.error('Err getting media', err)
      }
    }

      // //   // The offerer creates an offer, setsLocalDescription, sends it to answerer
      // //   // Answerer sets the offer as the remoteDescription
      // //   // so user A localDescription === user B remoteDescription
    async theOffer() {
      try {
        const offer = await this.pc1.createOffer()
        this.pc1.setLocalDescription(await offer)
        this.pc2.setRemoteDescription(await offer)
        this.wsrtc.send(JSON.stringify({ 'sdp': await offer }))
      } catch(err) {
        console.error('Err creating offer', err)
      }
    }



      // //   // The answerer creates an answer, does reverse of the offer flow
      //   async function answerer() {
    const answer = await this.pc2.createAnswer()
    this.ourAnswer = answer
    answer.catch(err => console.error('Err creating answer', err))
    this.pc2.setLocalDescription(await answer)
    this.pc1.setRemoteDescription(await answer)
    this.wsrtc.send(JSON.stringify({ 'sdp': await answer }))
      //   // now we'll see the ice connection events from above fire, and the connections
      //   // will go to connected state and the onaddstream events will fire
  }

}