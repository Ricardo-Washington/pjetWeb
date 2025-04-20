<<<<<<< HEAD
firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "/projet/index/index.html"
    }
})

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "/projet/login/login.html";
    }).catch(() => {
        alert('Erro de logout!');
    })
}
=======
>>>>>>> 3842a2f05a2aab63d8b6879f8d3f00d8b7a7f875
