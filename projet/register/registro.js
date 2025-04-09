function onChangeEmail() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = ValidateEmail(email) ? "none" : "block";
}

function onChangeName() {
    const name = form.name().value;
    form.nameRequiredError().style.display = name ? "none" : "block";
}

function onChangePhone() {
    const phone = form.phone().value; 
    form.phoneRequiredError().style.display = phone ? "none" : "block";
    form.phoneInvalidError().style.display = validatePhoneNumber(phone) ? "none" : "block";
}
function onChangeCpf() {
    const cpf = form.cpf().value; 
    form.cpfRequiredError().style.display = cpf ? "none" : "block";
    form.cpfInvalidError().style.display = validateCPF(cpf) ? "none" : "block";
}



const form = {
    email: () => document.getElementById('email'),
    emailRequiredError: () => document.getElementById('email-required-error'),
    emailInvalidError: () => document.getElementById('email-invalid-error'),

    name: () => document.getElementById('name'),
    nameRequiredError: () => document.getElementById('name-required-error'),

    password: () => document.getElementById('password'),

    confirmPassword: () => document.getElementById('confirmPassword'),
    
    phone: () => document.getElementById('phone'),
    phoneRequiredError: () => document.getElementById('phone-required-error'),
    phoneInvalidError: () => document.getElementById('phone-invalid-error'),

    cpf: () => document.getElementById('cpf'),
    cpfRequiredError: () => document.getElementById('cpf-required-error'),
    cpfInvalidError: () => document.getElementById('cpf-invalid-error'),
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


