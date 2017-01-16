import auth from '../js/auth.js'
import docsave from '../js/docsave.js'

module.exports = {
  logout() {
    this.showControls();
    auth.logout();
  },

  uploadDoc(id) {
    docsave.getDoc(this, id);
  },

  showControls() {
    this.showControl = !this.showControl;
  }
}