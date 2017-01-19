import auth from '../js/auth.js'
import docsave from '../js/docsave.js'
import editor from '../js/editor.js'

module.exports = {
  logout() {
    this.showControls();
    auth.logout();
    this.showNone();
  },

  uploadDoc(id) {
    docsave.getDoc(this, id);
  },

  showControls() {
    this.showControl = !this.showControl;
  },

  swapSaveAs() {
    this.savingAs = !this.savingAs;
  },

  saveAs(name) {
    if (this.docName !== '') {
      let stringIt = editor.quill.getContents();
    // saveDoc makes the actual call to the database with the data
      let prepDoc = {
        username: auth.user.data.username,
        name: this.docName,
        doc: auth.encrypt(JSON.stringify(stringIt))
      }
      // fixDups adds a number to the saved doc in order to ensure all docs
      // have unique names
      prepDoc = docsave.fixDups(prepDoc);
      docsave.sendDoc(this, prepDoc);
      this.swapSaveAs();
      this.docName = '';
    } else {
      this.swapSaveAs();
    }
  },

  save() {
  // save updates the form that is currently loaded
    let stringIt = editor.quill.getContents();

    let assembleData = {
      id: docsave.docData.currentDoc.id,
      username: auth.user.data.username,
      name: docsave.docData.currentDoc.name,
      doc: auth.encrypt(JSON.stringify(stringIt))
    }
    docsave.updateDoc(this, assembleData);
  },

  newDoc() {
    docsave.docData.currentDoc = {
      name: '',
      doc: ''
    };
    editor.quill.deleteText(0);
  },

  deleteDoc() {
    docsave.removeDoc(this, docsave.docData.currentDoc.id);
  },

  showSignin() {
    this.isSignupShowing = false;
    this.isLoginShowing = !this.isLoginShowing;
  },

  showSignup() {
    this.isLoginShowing = false;
    this.isSignupShowing = !this.isSignupShowing;
  },

  showNone() {
    this.isSignupShowing = false;
    this.isLoginShowing = false;
  }
}
