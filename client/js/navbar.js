// Created by Duncan on 12.29.2016
// Methods for navbar.vu

module.exports = {
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