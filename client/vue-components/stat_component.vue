<template>
<div class="stat-container">
  <div class="sentiment-title">Sentiment Analysis</div>
  <div class="sentiment-controls">
    <button @click="analyseSentiment('on')">On</button>
    <button @click="analyseSentiment('off')">Off</button>
  </div>
  <button style="padding-top: 0.5em" @click="getStats">Get Stats</button>
    <canvas id="wordDist" height="250"></canvas>
    <canvas id="wordFreq" height="275"></canvas>
</div>
</template>

<script>
  import {Quill} from '../js/sentiment_blots.js'
  export default {
    props: ['quill'],
    methods: {
      analyseSentiment(tog) {
        console.log('toggle:',tog)
        var delta = this.quill.getContents()
        //
        // console.log('Outgoing Delta:', delta)
        $.post('/sentiment', {content: JSON.stringify(delta), toggle: tog})
          .then(res=>{
            var sentiment_update = JSON.parse(res)
            //
            // console.log('Incoming Delta:',sentiment_update)
            this.quill.setContents(sentiment_update, 'user')
            this.quill.update()
          })
      },
      getStats() {
        $.post('/stats', {text: $('.ql-editor').text()})
          .then(res=>{
            console.log(res)
            var wordDistCTX = document.getElementById('wordDist').getContext('2d')
            var wordDistData = {labels: [], datasets: [{
              backgroundColor: [],
              data: []
            }]}
            for (var key in res.stats){
              wordDistData.labels.push(key)
              wordDistData.datasets[0].data.push(res.stats[key])
            }
              wordDistData.datasets[0].backgroundColor = [
                "#EFD1C6",
                "#9d60ec",
                "#95a5a6",
                "#9cdee0",
                "#34495e"
              ]
            var wordDistChart = new Chart(wordDistCTX, {
              type: 'doughnut',
              data: wordDistData
            });
            var wordFreqCTX = document.getElementById('wordFreq').getContext('2d')
            var wordFreqData = {}
            wordFreqData.labels = new Array(res.freq.wordLen.length).fill('')
            wordFreqData.labels[0] = res.freq.shortest
            wordFreqData.labels[res.freq.wordLen.length-1] = res.freq.longest
            wordFreqData.datasets = [{
              label: 'Word Length Distribution',
              fill: true,
              lineTension: 0.25,
              backgroundColor: "#95a5a6",
              pointRadius: 2,
              borderColor: "#EFD1C6"
            }]
            wordFreqData.datasets[0].data = res.freq.wordLen.map(i=>i[1])
            var wordFreqChart = new Chart(wordFreqCTX, {
              type: 'line',
              data: wordFreqData
            })
      })
      },
    }
  }
</script>

<style scoped>

button{
  border: none;
  outline: 0;
  background-color: #FFF;
  font-weight: 600;
}
.sentiment-title{
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
.sentiment-controls{
  display: inline-flex;
  padding-bottom: 0.5em;
  border-bottom: 0.25em solid #333;
}
.sentiment-controls button{
  width: 50%;
}
.stat-container{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.stat-container canvas{
  width: 100%;
}

</style>
