import auth from './auth.js'

const USER_URL = 'https://127.0.0.1:8443';

export default {
  docData: {
    currentDoc: '',
    docs: [], // array of --> {name: 'docname', id: '932ejwocnodmcl'}
  },

  sendDoc(context, data) {
    context.$http.post(`${USER_URL}/db/docs`, data)
      .then((res) => {
        let data = JSON.parse(res.body);
        let status = JSON.parse(res.status);
        let saved = {
          name: data.name,
          id: data.id
        }
        this.docs.push(saved)
        console.log(this.docs)
      })
      .catch((err) => {
        throw err;
      });
  },

  getAllDocs(context, data) {
    context.$http.get(`${USER_URL}/db/docs`, {params: {'username': data.username}})
      .then((res) => {
        let data = res.body;
        data.forEach((obj) => {
          let storedData = {
            id: obj.id,
            name: obj.name
          }
          this.docData.docs.push(storedData);
        });
      })
      .catch((err) => {
        console.error('No saved docs')
      });
  },

  getDoc(context, id, cb) {
    context.$http.get(`${USER_URL}/db/docs`, {params: {'id': '587c17ce42f5bfeb5673fd31'}})
      .then((res) => {
        let data = res.body;
        let fix = auth.decrypt(data[0].doc);
        this.docData.currentDoc = fix;
      })
      .catch((err) => {
        console.error('Doc not found')
      });
  },

  fixDups(doc) {
    let count = 0;
    let docName = doc.name.split('(')[0];
    this.docs.forEach((obj) => {
      let objName = obj.name.split('(')[0];
      if (objName === docName) {
        count++;
      }
    });
    doc.name = `${doc.name}(${count+1})`
    return doc;
  }
}