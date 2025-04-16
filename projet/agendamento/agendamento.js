firebase.auth().onAuthStateChanged(user => {
    if(!user) {
        window.location.href = "../index/index.html"
    }
})

function logout(){
     firebase.auth().signOut().then(() =>{
        window.location.href = "../login/login.html";
     }).catch(() => {
        alert('Erro de logout!');
     })
}