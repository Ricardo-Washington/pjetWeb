
firebase.auth().onAuthStateChanged(user => {
  if(!user) {
    window.location.href = "/projet/login/login.html"
  }
})