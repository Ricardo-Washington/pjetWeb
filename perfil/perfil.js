firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
        window.location.href = "/login/login.html";
        return;
    }
    const doc = await firebase.firestore().collection('clientes').doc(user.uid).get();
    if (doc.exists) {
        const dados = doc.data();
        document.getElementById('perfil-nome').value = dados.nome || '';
        document.getElementById('perfil-telefone').value = dados.telefone || '';
        document.getElementById('perfil-email').value = dados.email || user.email || '';
    }
});

// Salvar alterações
document.getElementById('form-perfil').onsubmit = async function(e) {
    e.preventDefault();
    const nome = document.getElementById('perfil-nome').value.trim();
    const telefone = document.getElementById('perfil-telefone').value.trim();
    const msg = document.getElementById('perfil-msg');
    const user = firebase.auth().currentUser;
    if (!user) {
        msg.textContent = "Usuário não autenticado!";
        msg.style.color = "red";
        return;
    }
    try {
        await firebase.firestore().collection('clientes').doc(user.uid).update({
            nome,
            telefone
        });
        msg.textContent = "Dados atualizados com sucesso!";
        msg.style.color = "#2e7d32";
        setTimeout(() => {
            window.location.href = "/home/newHome.html";
        }, 1000); // Redireciona após 1 segundo
    } catch (error) {
        msg.textContent = "Erro ao atualizar: " + error.message;
        msg.style.color = "red";
    }
};