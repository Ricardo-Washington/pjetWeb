function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}
function onChangePassword(){
    togglePasswordErrors();
    toggleButtonsDisable();
    toggleButtonsDisable();
}

function isEmailValid() {
    const email = form.email().value;
    if(!email){
        return false;
    }
    return validateEmail(email);
}

function isPasswordValid() {
    return form.password().value ? true : false;
}

function toggleEmailErrors(){
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";


    form.emailInvalidError().style.display = validateEmail(email) ? "none": "block";
   

}
function togglePasswordErrors(){
    const password = form.passwoerd().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
}

function toggleButtonsDisable(){
    const emailValid = isEmailValid();
    form.recoverPasswordButton().disabled = !emailValid;

    const passwoerdValid =  isPasswordValid();
    form.loginButton().disabled = !emailValid || !passwoerdValid;
}

function validateEmail(email){
    return /\S+@\S+\.\S+/.test(email);
    // função achada na internet 
    // sem galantia, clompo puque quiz!
} 

const form = {
    email: () => document.getElementById('email'),
    emailInvalidError: () => document.getElementById('email-invalid-error'),
    emailRequiredError: () => document.getElementById('email-required-error'),



    loginButton: () => document.getElementById('login-button'),


    passwoerd: () => document.getElementById('password'),
    recoverPasswordButton: () => document.getElementById("recover-password-button"),
    passwordRequiredError: () =>document.getElementById('password-required-error'),
    
}

