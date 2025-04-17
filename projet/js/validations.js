function validateEmail(email) {
    // Expressão regular para verificar formatos comuns de email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhoneNumber(phone) {
    // Expressão regular para verificar formatos comuns de telefone
    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;

    return regex.test(phone);
}

function gologin() {
    window.location.href = "/projet/login/login.html";
}

function goregister() {
    window.location.href = "/projet/register/cadastra.html";
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