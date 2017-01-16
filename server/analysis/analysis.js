const sentiment = require('sentiment')
const WordPOS = require('wordpos')

let wordpos = new WordPOS()

function sent(req, res){
  //console.log('sentiment post received, req.body:', req.body.content)
  let ps = req.body.content.split(/<p>|<\/p>|<h1>|<\/h1>/)
            .filter(i=>i !== '')// && i !== '<br>')
            .map(i=>i.split('. '))
  ps = ps.map(i=>`<p>${i.map(s=>`<span class="sent${sentiment(s).score}">${s}</span>`)}</p>`).join('')
  console.log(ps)
  res.send(ps)
}

function stats(req, res){
  console.log('stats post received, reqbody:', req.body.text)
  wordpos.getPOS(req.body.text, (posObj)=>{
    let stats = {};
    stats.nouns = posObj.nouns.length
    stats.verbs = posObj.verbs.length
    stats.adjectives = posObj.adjectives.length
    stats.adverbs = posObj.adverbs.length
    stats.rest = posObj.rest.length
    res.send(stats)
  })
}

module.exports.sentiment = sent
module.exports.stats = stats
