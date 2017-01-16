import auth from '../js/auth.js'
import docsave from '../js/docsave.js'

module.exports = {
  logout() {
    auth.logout();
  },

  uploadDoc(id) {
    docsave.getDoc(this, id);
  }
}