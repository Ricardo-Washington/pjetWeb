function onChangeEmail() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = ValidateEmail(email) ? "none" : "block";

    
}

const form = {
    email: () => document.getElementById('email'),
    emailRequiredError: () => document.getElementById('email-required-error'),
    emailInvalidError: () => document.getElementById('email-invalid-error'),

    name: () => document.getElementById('nome'),

    confirmPassword: () => document.getElementById('confirmPassword'),
    password: () => document.getElementById('password'),
    phone: () => document.getElementById('phone'),
    cpf: () => document.getElementById('cpf')
  }