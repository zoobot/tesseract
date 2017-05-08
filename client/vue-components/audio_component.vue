<template>
    <div class="ambient">
      <div class="audio-title">Ambient Sounds</div>
      <div class="audio-tracks">
        <audio v-for="track in tracks" :id="track.id" :src="track.url" :paused="track.paused">
        </audio>
        <div class="audio-icons">
          <!-- <img class="audio-icon" v-for="track in tracks" :id="track.id" @click="toggleButton($event)" v-html="track.img">
 -->
          <img :src="track.img" class="audio-icon" v-for="track in tracks" :id="track.id" @click="toggleButton($event)">
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {

  data() {
    return {
    tracks: [
    {
      id: 'ocean',
      url: '/client/assets/audio/whales.mp3',
      img:'/client/assets/images/whale.svg',
      paused: true
    },
        {
      id: 'thunder',
      url: '/client/assets/audio/brownnoise.mp3',
      img:'/client/assets/images/sin.svg',
      paused: true
    },
          {   id: 'rain',
      url: '/client/assets/audio/rain.mp3',
      img:'/client/assets/images/tree.svg',
      paused: true
    },
   {
     id: 'fire',
     url: '/client/assets/audio/Campfire_sound_ambience.mp3',
     img:'/client/assets/images/fire.svg',
     paused: true
    },
    {
      id: 'whitenoise',
      url: '/client/assets/audio/whitenoise.mp3',
      img:'/client/assets/images/square.svg',
      paused: true
    },




   //     {
   //   id: 'basketball',
   //   url: "/client/assets/audio/Stomp-Basketballs.mp3",
   //   img: '/client/assets/images/basketball.svg',
   //   paused: true
   // },

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