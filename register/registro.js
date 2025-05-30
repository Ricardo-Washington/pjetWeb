// Redireciona para a home se o usuário já estiver logado
firebase.auth().onAuthStateChanged(user => {
    if(user) {
        window.location.href = "/home/newHome.html";
    }
})

/*
  Valida o campo de e-mail em tempo real, mostrando mensagens de erro se necessário.
 */
function onChangeEmail() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = ValidateEmail(email) ? "none" : "block";
    toggRegisterButtonDisable();
}

/**
 * Valida o campo de nome em tempo real, mostrando mensagem de erro se estiver vazio.
 */
function onChangeName() {
    const name = form.name().value;
    form.nameRequiredError().style.display = name ? "none" : "block";
    toggRegisterButtonDisable();
}

/**
 * Valida o campo de telefone em tempo real, mostrando mensagens de erro se necessário.
 */
function onChangePhone() {
    const phone = form.phone().value; 
    form.phoneRequiredError().style.display = phone ? "none" : "block";
    form.phoneInvalidError().style.display = validatePhoneNumber(phone) ? "none" : "block";
    toggRegisterButtonDisable();
}

/**
 * Valida o campo de CPF em tempo real, mostrando mensagens de erro se necessário.
 */
function onChangeCpf() {
    const cpf = form.cpf().value; 
    form.cpfRequiredError().style.display = cpf ? "none" : "block";
    form.cpfInvalidError().style.display = validateCPF(cpf) ? "none" : "block";
    toggRegisterButtonDisable();
}

/**
 * Valida o campo de senha em tempo real, mostrando mensagens de erro se necessário.
 */
function onChangePassword(){
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
    form.passwordMinLengthError().style.display = password.length >= 6 ? "none" : "block";
    validarPasswordMatch();
    toggRegisterButtonDisable();
}

/**
 * Valida o campo de confirmação de senha em tempo real.
 */
function onChangeConfirmPassword(){
    validarPasswordMatch();
    toggRegisterButtonDisable();
}

/**
 * Verifica se as senhas digitadas coincidem e exibe mensagem de erro se não coincidirem.
 */
function validarPasswordMatch(){
    const password = form.password().value;
    const confirmPassword = form.confirmPassword().value;
    form.confirmPasswordDoesntMatchError().style.display = password == confirmPassword ? "none" : "block";
}

/**
 * Habilita ou desabilita o botão de cadastro conforme a validação do formulário.
 */
function toggRegisterButtonDisable(){
    form.registerButton().disabled = !isFormValid();
}

/**
 * Verifica se todos os campos do formulário estão válidos.
 * Retorna true se estiver tudo certo, false caso contrário.
 */
function isFormValid(){
    const email = form.email().value;
    if(!email || !ValidateEmail(email)){
        return false;
    }
    const password = form.password().value;
    if (!password || password.length < 6) {
        return false;
    }
    const confirmPassword = form.confirmPassword().value;
    if(password != confirmPassword){
        return false;
    }
    const name = form.name().value;
    if(!name){
        return false;
    }
    const phone = form.phone().value;
    if(!phone || !validatePhoneNumber(phone)){
        return false;
    }
    const cpf = form.cpf().value;
    if(!cpf || !validateCPF(cpf)){
        return false;
    }
     return true;
}

/**
 * Realiza o cadastro do usuário no Firebase Auth e salva os dados no Firestore.
8
function register() {
    const email = form.email().value;
    const password = form.password().value;
    const name = form.name().value;
    const phone = form.phone().value;
    const cpf = form.cpf().value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const userId = userCredential.user.uid;
        // Salva os dados do usuário no Firestore
        return firebase.firestore().collection('usuarios').doc(userId).set({
            nome: name,
            email: email,
            telefone: phone,
            cpf: cpf,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp()
        });
    })
    .then(() => {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "/login/login.html";
    })
    .catch(error => {
        if (error.code === "auth/email-already-in-use") {
            alert("Este e-mail já está cadastrado. Por favor, use outro.");
        } else {
            alert("Erro: " + error.message);
        }
    });
}
*/
  

/**
 * Objeto utilitário para acessar campos e mensagens do formulário.
 */
const form = {
    email: () => document.getElementById('email'),
    emailRequiredError: () => document.getElementById('email-required-error'),
    emailInvalidError: () => document.getElementById('email-invalid-error'),

    name: () => document.getElementById('name'),
    nameRequiredError: () => document.getElementById('name-required-error'),

    password: () => document.getElementById('password'),
    passwordRequiredError: () => document.getElementById('password-required-error'),
    passwordMinLengthError: () => document.getElementById('password-min-length-error'),

    confirmPassword: () => document.getElementById('confirmPassword'),
    confirmPasswordDoesntMatchError: () => document.getElementById('password-doesnt-match-error'),
    confirmInvalidError: () => document.getElementById('confirm-password-Invalid-error'),
    
    phone: () => document.getElementById('phone'),
    phoneRequiredError: () => document.getElementById('phone-required-error'),
    phoneInvalidError: () => document.getElementById('phone-invalid-error'),

    cpf: () => document.getElementById('cpf'),
    cpfRequiredError: () => document.getElementById('cpf-required-error'),
    cpfInvalidError: () => document.getElementById('cpf-invalid-error'),

    registerButton: () => document.getElementById('register-button')
}

/**
 * Valida se o e-mail está em um formato válido.
 */
function ValidateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida se o telefone está em um formato válido brasileiro.
 */
function validatePhoneNumber(phone) {
    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    return regex.test(phone);
}

/**
 * Valida se o CPF é válido (estrutura e dígitos verificadores).
 */
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let firstCheckDigit = 11 - (sum % 11);
    if (firstCheckDigit >= 10) firstCheckDigit = 0;
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let secondCheckDigit = 11 - (sum % 11);
    if (secondCheckDigit >= 10) secondCheckDigit = 0;
    return (
        firstCheckDigit === parseInt(cpf.charAt(9)) &&
        secondCheckDigit === parseInt(cpf.charAt(10))
    );
}

/**
 * Realiza o cadastro do usuário no Firebase Auth e salva os dados completos na coleção "clientes".
 
function register() {
    alert("Clicou no botão de cadastro");
    const email = form.email().value;
    const password = form.password().value;
    const name = form.name().value;
    const phone = form.phone().value;
    const cpf = form.cpf().value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Aguarda o usuário estar autenticado de fato
        return new Promise(resolve => {
            const unsubscribe = firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    unsubscribe();
                    resolve(user.uid);
                }
            });
        });
    })
    .then((userId) => {
        return firebase.firestore().collection('clientes').doc(userId).set({
            uid: userId,
            nome: name,
            email: email,
            telefone: phone,
            cpf: cpf,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp()
        });
    })
    .then(() => {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "/login/login.html";
    })
    .catch(error => {
        if (error.code === "auth/email-already-in-use") {
            alert("Este e-mail já está cadastrado. Por favor, use outro.");
        } else {
            alert("Erro: " + error.message);
        }
    });
}
    */