
firebase.auth().onAuthStateChanged(user => {
  if(!user) {
    window.location.href = "/login/login.html"
  }
})