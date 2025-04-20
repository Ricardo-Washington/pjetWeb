//Confere se o user esta logado
firebase.auth().onAuthStateChanged(user => {
<<<<<<< HEAD:projet/agendamento/agendamento.js
    if (!user) {
        window.location.href = "/projet/index/index.html"
    }
})

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "/projet/login/login.html";
    }).catch(() => {
=======
    if(!user) {
        window.location.href = "/projet/home/home.html"
    }
})

// Efetua o logouot
function logout(){
     firebase.auth().signOut().then(() =>{
        window.location.href = "/projet/login/login.html";
     }).catch(() => {
>>>>>>> 3842a2f05a2aab63d8b6879f8d3f00d8b7a7f875:projet/js/auth.js
        alert('Erro de logout!');
    })
}