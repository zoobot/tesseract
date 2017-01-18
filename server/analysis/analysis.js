const sentiment = require('sentiment')
const WordPOS = require('wordpos')

let wordpos = new WordPOS()

function sent(req, res) {

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

  console.log('**********\nRESULT:\n',result,'\n**********')


  // source.ops.forEach(i => {
  //   console.log('i attr:',i.attributes)
  //   var attr = i.attributes || {};
  //   // console.log('line is:', i)
  //   var nsplit = i.insert.split('\n')
  //   // console.log('array of line:', i.insert.match(/\(?[^\.\?\!]+[\.{1,3}!\?\n?] ?\)?/g))
  //   nsplit.forEach(n=>{
  //     if (n !== ''){
  //       var lineArr = n.match(/\(?[^\.\?\!]+[\.{1,3}!\?] ?\)?/g)
  //       lineArr.forEach(j => {
  //         var score = sentiment(j).score
  //         score = score > 5 ? 5 : score
  //         score = score < -5 ? -5 : score
  //         var sent = score > 0 ? 'pos' + score : 'neg' + Math.abs(score)
  //         attr[sent] = true
  //         // console.log('j:', j, 'attr', attr)
  //         resp.ops.push({
  //           attributes: attr,
  //           insert: j
  //         })
  //       })
  //     } else {
  //       resp.ops[resp.ops.length-1].insert += '\n'
  //     }
  //   })
  // })
  // var testObj1 = [ { insert: 'Fucking heading.' },
  // { attributes: { header: 1, pos1: true }, insert: '\n' },
  // { insert: '\n' },
  // { attributes: { pos1: true, bold: true },
  //   insert: 'Bold shit and garbage.' },
  // { insert: '\n \n\nTwo sentences back to back. This is the second one damnit!\n' } ]
  // var testObj2 = [ { insert: 'Fucking heading.' },
  // { attributes: { header: 1, pos1: true }, insert: '\n' },
  // { insert: '\n' },
  // { attributes: { pos1: true, bold: true },
  //   insert: 'Bold shit and garbage.' },
  // { insert: '\n \n\n' },
  // { insert: 'Two sentences back to back. This is the second one damnit!'},
  // { insert: '\n' } ]
  // var testObj3 = [ { insert: 'Line break here:\nNew sentence.\nSecond sentence.\nThird sentence.\n\nTwo breaks above.\n' } ]
  var testObj4 = [
    { insert: 'Line break here:'},
    { insert: '\n'},
    { insert: 'New sentence.'},
    { insert: '\n'},
    { insert: 'Second sentence.'},
    { insert: '\n'},
    { insert: 'Third sentence.'},
    { insert: '\n'},
    { insert: '\n'},
    { insert: 'Two breaks above.'},
    { insert: '\n'},
    { insert: '' } ]


  // console.log('nParse result:',nParse(source))
  res.status(201).send(JSON.stringify(result))

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

module.exports.sentiment = sent
module.exports.stats = stats
