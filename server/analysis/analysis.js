const sentiment = require('sentiment')
const WordPOS = require('wordpos')

let wordpos = new WordPOS()

function sent(req, res) {
  if (req.body.toggle === 'off'){
    // console.log("Toggle off, should go to removeSent")
    return removeSent(req, res)
  }
  // console.log("TOGGLE:", req.body.toggle)

  var source = nParse(JSON.parse(req.body.content))
  var result = {ops: []}


  source.ops.forEach(line=>{
    if (/\n/.test(line.insert)){
      result.ops.push(line)
    } else {
      var attr = false
      if (line.attributes !== undefined){
        attr = true
      }

      var sentences = line.insert.match(/\(?[^\.\?\!]+([(\.+)!\?]?| $)\)?/g)
      if (sentences){
        sentences.forEach(sentence => {
          var sentenceAttr = {}
          if (sentence) {
            var score = sentiment(sentence).score
            score = score > 5 ? 5 : score
            score = score < -5 ? -5 : score
            var sent = score >= 0 ? 'pos' + score : 'neg' + Math.abs(score)
            if (!attr) {
              attr = {}
            } else {
              for (var key in line.attributes){
                console.log('copy attribute:', key)
                sentenceAttr[key] = line.attributes[key]
              }
            }
            sentenceAttr[sent] = true
            console.log('sentenceAttr is now:', sentenceAttr)
            result.ops.push({attributes: sentenceAttr, insert: sentence})
          }
        })
      }
    }
  })

  res.status(201).send(JSON.stringify(result))

}

function removeSent(req, res) {
  var source = JSON.parse(req.body.content)

  source.ops = source.ops.map(line=>{
    if (line.attributes !== undefined){
      for (var i=1; i<=5; i++){
        delete line.attributes['pos' + i]
        delete line.attributes['neg' + i]
      }
    }
    return line
  })
  console.log('Remove Sent, source is:', source)
  res.status(201).send(JSON.stringify(source))
}

function nParse(src){
  // console.log('nParse source:', src)
  var clean = {ops: []}
  src.ops.forEach(line=>{
    if (!/\n/.test(line.insert)){
      clean.ops.push(line)
    } else {
      var attr = false
      if (line.attributes !== undefined){
        attr = line.attributes
      }
      var nSplit = line.insert.split('\n')
      // console.log('nSplit:', nSplit)
      nSplit.forEach((val, ind)=>{
        var insert = val.trim()
        if (insert.length > 0){
          if (attr) {
            clean.ops.push({attributes: attr, insert: insert})
            clean.ops.push({attributes: attr, insert: '\n'})
          } else {
            clean.ops.push({insert: insert})
            clean.ops.push({insert: '\n'})
          }
          if (ind === nSplit.length-1){
            clean.ops.pop()
            clean.ops.push({insert: ' '})
          }
        } else {
          if (attr) {
            // Handle Heading tags because they're fucked.
            if (attr.heading !== null){
              if (clean.ops[clean.ops.length-1].insert === '\n'){
                clean.ops.pop()
                clean.ops.push({attributes: attr, insert: '\n'})
                clean.ops.push({insert: '\n'})
              } else {
                clean.ops.push({attributes: attr, insert: '\n'})
              }
            } else {
              clean.ops.push({attributes: attr, insert: '\n'})
            }
          } else {
            clean.ops.push({insert: '\n'})
          }
          if (ind === nSplit.length-1){
            clean.ops.pop()
            clean.ops.push({insert: ''})
          }
        }
      })
    }
  })
  // console.log('nParse result:', clean)
  return clean
}

function stats(req, res) {
  // console.log('stats post received, reqbody:', req.body.text)
  var words = req.body.text.split(/[ \n\,\.\!\?]+/).filter(i => i !== '')
  var wordFreqObj = words
                .map(i=>i.length).sort((a,b)=>a-b)
                .reduce((m, i)=>{
                  if (!m[i]){
                    m[i] = 1
                  } else {
                    m[i]++
                  }
                  return m
                }, {})
  console.log(wordFreqObj)
  var wordLen = []
  for (var key in wordFreqObj){
    wordLen.push([key, wordFreqObj[key]])
  }
  wordLen = wordLen.sort((a, b)=>{a[0] - b[0]})

  var shortest = longest = words[0]
  words.forEach(w=>{
    shortest = shortest.length < w.length ? shortest : w
    longest = longest.length > w.length ? longest : w
  })
  console.log('words:', words, 'wordLen', wordLen, shortest, longest)
  var freq = {}
  freq.shortest = shortest
  freq.longest = longest
  freq.wordLen = wordLen

  var stats = {};
  wordpos.getPOS(req.body.text, (posObj) => {
    stats.nouns = posObj.nouns.length
    stats.verbs = posObj.verbs.length
    stats.adjectives = posObj.adjectives.length
    stats.adverbs = posObj.adverbs.length
    stats.rest = posObj.rest.length
    res.send({stats, freq})
  })
}


module.exports.sentiment = sent
module.exports.stats = stats
module.exports.removeSent = removeSent
