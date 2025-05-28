firebase.auth().onAuthStateChanged(user => {
    if(user) {
        window.location.href = "/home/newHome.html";
    }
})

function onChangeEmail() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = ValidateEmail(email) ? "none" : "block";
    toggRegisterButtonDisable();
}

function onChangeName() {
    const name = form.name().value;
    form.nameRequiredError().style.display = name ? "none" : "block";
    toggRegisterButtonDisable();
}

function onChangePhone() {
    const phone = form.phone().value; 
    form.phoneRequiredError().style.display = phone ? "none" : "block";
    form.phoneInvalidError().style.display = validatePhoneNumber(phone) ? "none" : "block";
    toggRegisterButtonDisable();
}
function onChangeCpf() {
    const cpf = form.cpf().value; 
    form.cpfRequiredError().style.display = cpf ? "none" : "block";
    form.cpfInvalidError().style.display = validateCPF(cpf) ? "none" : "block";
    toggRegisterButtonDisable();
}
function onChangePassword(){
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
    form.passwordMinLengthError().style.display = password.length >= 6 ? "none" : "block";
    validarPasswordMatch();
    toggRegisterButtonDisable();
}
function onChangeConfirmPassword(){
    validarPasswordMatch();
    toggRegisterButtonDisable();
}
function validarPasswordMatch(){
    const password = form.password().value;
    const confirmPassword = form.confirmPassword().value;
    form.confirmPasswordDoesntMatchError().style.display = password == confirmPassword ? "none" : "block";
}
function toggRegisterButtonDisable(){
   
    form.registerButton().disabled = !isFormValid();
}
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

// Função para obter mensagens de erro amigáveis
// função para cadastrar os dados do usuario no firebase
function register() {
    const email = form.email().value;
    const password = form.password().value;
    const name = form.name().value;
    const phone = form.phone().value;
    const cpf = form.cpf().value;


    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const userId = userCredential.user.uid;
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

function ValidateEmail(email) {
    // Expressão regular para verificar formatos comuns de email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhoneNumber(phone) {
    // Expressão regular para validar o número de telefone
    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    return regex.test(phone);
}
function validateCPF(cpf) {
    // Remove caracteres especiais (pontos e traços)
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se o CPF tem 11 dígitos ou é uma sequência de números repetidos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let firstCheckDigit = 11 - (sum % 11);
    if (firstCheckDigit >= 10) firstCheckDigit = 0;

    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let secondCheckDigit = 11 - (sum % 11);
    if (secondCheckDigit >= 10) secondCheckDigit = 0;

    // Verifica os dois dígitos verificadores
    return (
        firstCheckDigit === parseInt(cpf.charAt(9)) &&
        secondCheckDigit === parseInt(cpf.charAt(10))
    );
}


