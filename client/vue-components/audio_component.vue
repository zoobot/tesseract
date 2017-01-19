<template>
    <div>
    <audio v-for="track in tracks" :id="track.id" :src="track.url" :paused="track.paused" @click="toggleButton($event)">
    </audio>
        <div v-for="track in tracks" @click="toggleButton($event)">{{track.id}}</div>
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
     svg:'',
     paused: true
   },
   {
     id: 'fire',
     url: "/client/assets/audio/Campfire_sound_ambience.mp3",
     svg:'',
      paused: true
    },
    {
      id: 'flute',
      url: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Hymne_delphique.ogg",
      svg:'',
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
      svg:'',
      paused: true
    },
    {
      id: 'eye',
      url: "/client/assets/audio/Growth-Mindset-Hypnosis.mp3",
      svg:'',
      paused: true
    }
   ]}
  },

  methods: {

    toggleButton(e) {
      let item = e.target.innerText;
      for (var i = 0; i < this.tracks.length; i++) {
        if (item === this.tracks[i].id) {
          this.tracks[i].paused = !this.tracks[i].paused
          console.log('this is our track', this.tracks[i].paused)
        }
      }
    }
  }
}
</script>

<style>

audioref {
  background-color:transparent;
}

</style>
