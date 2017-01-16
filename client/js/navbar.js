import auth from '../js/auth.js'
import docsave from '../js/docsave.js'

module.exports = {
  logout() {
    auth.logout();
    this.showControls()
    docsave.docData.currentDoc = {
      name: '',
      doc: ''
    }
  },

  uploadDoc(id) {
    docsave.getDoc(this, id);
  },

  showControls() {
    this.showControl = !this.showControl;
  }
}