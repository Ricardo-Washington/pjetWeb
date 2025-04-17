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