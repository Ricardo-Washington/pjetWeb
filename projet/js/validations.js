function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}
function gologin(){
    window.location.href = "/login/login.html";
}
function goregister(){
    window.location.href = "/register/cadastra.html";
}