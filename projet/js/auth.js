firebase.auth().onAuthStateChanged(user => {
    if(!user) {
        window.location.href = "/projet/home/home.html"
    }
})


function logout(){
     firebase.auth().signOut().then(() =>{
        window.location.href = "/projet/login/login.html";
     }).catch(() => {
        alert('Erro de logout!');
     })
}