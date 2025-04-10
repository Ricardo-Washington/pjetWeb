firebase.auth().onAuthStateChanged(function (user){
    if(user) {
        window.location.href = "../home/home.html";
    }
})

function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function onChangePassword() {
    toggleButtonsDisable();
    togglePasswordErrors();
} 
function recoverPassword() {
    
    firebase.auth().sendPasswordResetEmail(form.email().value).then(() => {
        alert('Email enviado com sucesso');
    }).catch(error => {
        alert('Usuario não encontrado');
    });
}

function login() {
    firebase.auth().signInWithEmailAndPassword(form.email().value, form.password().value).then(response => {
        window.location.href = "/home/home.html";
    }).catch(error => {
        alert(getErrorMessege(error));
    });
}

function getErrorMessege(error){
    if(error.code == "auth/invalid-credential"){
        return "Usuario não encontrado";
    }
    return error.message;
}

function registergo() {
    window.location.href = "/register/cadastra.html";
}

function toggleEmailErrors() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ?  "none" : "block";

    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
    
}

function togglePasswordErrors() {
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
    
}

function toggleButtonsDisable() {
    const emailValid = isEmailValid();
    form.recoverPasswordButton().disabled = !emailValid;

    const passwordValid = isPasswordValid();
    form.loginButton().disabled = !emailValid || !passwordValid;
}

function isEmailValid() {
    const email = form.email().value;
    if (!email) {
        return false;
    }
    return validateEmail(email);
}

function isPasswordValid() {
    const password = form.password().value;
    if (!password) {
        return false;
    }
    return true;
}


const form = {
    email: () => document.getElementById("email"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),

    loginButton: () => document.getElementById("login-button"),

    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPasswordButton: () => document.getElementById("recover-password-button")

}
/*function validateEmail(email) {
    // Expressão regular para verificar formatos comuns de email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}*/