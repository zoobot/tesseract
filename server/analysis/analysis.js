const sentiment = require('sentiment')
const WordPOS = require('wordpos')

let wordpos = new WordPOS()

function sent(req, res) {
  // console.log('sentiment post received, req.body.content:', req.body.content)
  var source = JSON.parse(req.body.content)
  var colors = {
    "-5": "rgba(127, 9, 187, 0.44)",
    "-4": "rgba(146, 41, 199, 0.44)",
    "-3": "rgba(166, 76, 212, 0.44)",
    "-2": "rgba(187, 116, 223, 0.44)",
    "-1": "rgba(217, 173, 240, 0.44)",
    "0": "rgba(255, 255, 255, 0)",
    "1": "rgba(240, 174, 219, 0.44)",
    "2": "rgba(224, 127, 193, 0.44)",
    "3": "rgba(221, 89, 179, 0.44)",
    "4": "rgba(215, 51, 163, 0.44)",
    "5": "rgba(221, 7, 152, 0.44)",
  }


  var resp = {
    ops: []
  };
  source.ops.forEach(i => {
    var attr = i.attributes || {};
    console.log('line is:', i, 'attr is', attr)
    // console.log('array of line:', i.insert.match(/\(?[^\.\?\!]+[\.{1,3}!\?\n?] ?\)?/g))
    var lineArr = i.insert.match(/\(?[^\.\?\!]+[\.{1,3}!\??\n] ?\)?/g)
    if (lineArr){
      lineArr.forEach(j => {
        // console.log('j is:', j)

        if (!/\n[\W]/.test(j)){
          var sent = sentiment(j).score
          sent = sent > 5 ? 5 : sent
          sent = sent < -5 ? -5 : sent
          attr.background = colors[sent]
          attr.tagName = 'span'
          console.log('j:', j, 'attr', attr)
          resp.ops.push({
            attributes: attr,
            insert: j
          })
          resp.ops.push({insert: ''})
      } else {
        resp.ops.push({insert: j})
      }
      })
    }
      // .forEach(j => {
      //   console.log('j is:', j)
      //   attr.background = "#FFFFF" + sentiment(j).score
      //   resp.ops.push({
      //     attributes: attr,
      //     insert: j
      //   })
      // })
  })
  console.log('resp created:', resp)
  res.status(201).send(JSON.stringify(resp))
    // console.log('response created\n**********\n',resp)



  // var testObj = { ops:
  //   [
  //     {attributes: {bold: true}, insert: "So can we just make stuff up? "},
  //     {insert: "And have it appear in the text editor? Turnips are good. Bungee jumping is actually pretty boring. Free simpering!"},
  //     {attributes: {background: "rgba(199, 99, 27, 0.71)"}, insert: "Even putting bgcolor in?\n\n"},
  //     {insert: "It remains to be seen..."},
  //     {attributes: {class: "sent1"}, insert: "Custom class text here?"}
  //   ]
  // }
  // res.status(201).send(JSON.stringify(testObj))
  // let ps = req.body.content.split(/<p>|<\/p>|<h1>|<\/h1>/)
  //           .filter(i=>i !== '')// && i !== '<br>')
  //           .map(i=>i.split('. '))
  // ps = ps.map(i=>`<p>${i.map(s=>`<span class="sent${sentiment(s).score}">${s}</span>`)}</p>`).join('')
  // console.log(ps)
  // res.send(201, ps)
}

function stats(req, res) {
  console.log('stats post received, reqbody:', req.body.text)
  wordpos.getPOS(req.body.text, (posObj) => {
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
