<template>
    <div class="ambient">
      <div class="audio-title">Ambient Sounds</div>
      <div class="audio-tracks">
        <audio v-for="track in tracks" :id="track.id" :src="track.url" :paused="track.paused">
        </audio>
        <div class="audio-icons">
          <div class="audio-icon" v-for="track in tracks" :id="track.id" @click="toggleButton($event)" v-html="track.svg">
          </div>
        </div>
      </div>
    <div>
</template>

<script>
export default {

  data() {
    return {
    tracks: [
   {
     id: 'basketball',
     url: "/client/assets/audio/Stomp-Basketballs.mp3",
     svg: '',
     paused: true
   },
   {
     id: 'fire',
     url: "/client/assets/audio/Campfire_sound_ambience.mp3",
     svg:'<svg style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="#000000" d="M11.71,19C9.93,19 8.5,17.59 8.5,15.86C8.5,14.24 9.53,13.1 11.3,12.74C13.07,12.38 14.9,11.53 15.92,10.16C16.31,11.45 16.5,12.81 16.5,14.2C16.5,16.84 14.36,19 11.71,19M13.5,0.67C13.5,0.67 14.24,3.32 14.24,5.47C14.24,7.53 12.89,9.2 10.83,9.2C8.76,9.2 7.2,7.53 7.2,5.47L7.23,5.1C5.21,7.5 4,10.61 4,14A8,8 0 0,0 12,22A8,8 0 0,0 20,14C20,8.6 17.41,3.8 13.5,0.67Z" /></svg>',
     paused: true
    },
    {
      id: 'flute',
      url: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Hymne_delphique.ogg",
      svg:'<svg style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="#000000" d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8,12 6,14 6,16.5C6,19 8,21 10.5,21C13,21 15,19 15,16.5V6H19V3H12Z" /></svg>',
      paused: true
    },
    {
      id: 'square',
      url: "/client/assets/audio/White.mp3",
      svg:'',
      paused: true
    },
    {
      id: 'forest',
      url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Calling_of_Cicads_on_Ko_Tao%2C_Thailand_1.ogg",
      svg:'<svg style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="#000000" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" /></svg>',
      paused: true
    },
    {
      id: 'eye',
      url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Whales_and_Dolphins_whale_nature_sounds_songs_nueva_esparta.ogg",
      svg:'<svg style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="#000000" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z" /></svg>',
      paused: true
    }
   ]}
  },

  methods: {
    toggleButton(e) {
      let item = e.target.id;
      let sound = document.getElementById(item)
      for (var i = 0; i < this.tracks.length; i++) {
        if (item === this.tracks[i].id) {
          this.tracks[i].paused = !this.tracks[i].paused
          this.tracks[i].paused ? sound.pause() : sound.play()
        }
      }
    }
  }
}
</script>

<style>
.ambient{
  margin-bottom: 0.75em;
}
.audio-title{
  padding: 0.25em;
  border-bottom: 0.25em solid black;
}
.audio-tracks{
  display: inline-flex;
}
.audio-icons{
  display: flex;
  justify-content: space-around;
}
.audio-icon{
  padding: 0.25em;
}
</style>
