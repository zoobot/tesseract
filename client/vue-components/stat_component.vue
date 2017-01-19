<template>
<div>
    <button v-on:click="getStats"> Get Stats </button>
    <div>
        <canvas id="wordDist"></canvas>
    </div>
    <div>
        <canvas id="wordFreq" height="300"></canvas>
    </div>
    <button v-on:click="analyseSentiment('on')"> Analyse Sentiment </button>
    <button v-on:click="analyseSentiment('off')"> Sentiment Off </button>
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
                "#fa9ad3",
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
              lineTension: 0.3,
              backgroundColor: "#95a5a6",
              pointRadius: 2,
              borderColor: "#fa9ad3"
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
