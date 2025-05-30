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
        // Exibe a foto salva, se existir
        if (dados.fotoPerfilUrl) {
            document.getElementById('foto-perfil').src = dados.fotoPerfilUrl;
            document.querySelectorAll('.avatar-opcao').forEach(img => {
                img.classList.remove('selected');
                if (img.src.includes(dados.fotoPerfilUrl)) img.classList.add('selected');
            });
        }
    }
});

// Salvar alterações (nome e telefone)
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
        msg.style.display = "block";
        setTimeout(() => {
            window.location.href = "/home/newHome.html";
        }, 1200); // Dá tempo de ver a mensagem
    } catch (error) {
        msg.textContent = "Erro ao atualizar: " + error.message;
        msg.style.color = "red";
        msg.style.display = "block";
    }
};

function selecionarAvatar(src) {
    document.getElementById('foto-perfil').src = src;
    // Destaca o avatar selecionado
    document.querySelectorAll('.avatar-opcao').forEach(img => img.classList.remove('selected'));
    const selecionado = Array.from(document.querySelectorAll('.avatar-opcao')).find(img => img.src.includes(src));
    if (selecionado) selecionado.classList.add('selected');
    // Salva no Firestore
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.firestore().collection('clientes').doc(user.uid).update({
            fotoPerfilUrl: src
        });
    }
}

function abrirModalAvatar() {
    document.getElementById('modal-avatar').style.display = 'flex';
}
function fecharModalAvatar() {
    document.getElementById('modal-avatar').style.display = 'none';
}
function selecionarAvatarModal(src) {
    document.getElementById('foto-perfil').src = src;
    fecharModalAvatar();
    // Salva no Firestore
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.firestore().collection('clientes').doc(user.uid).update({
            fotoPerfilUrl: src
        });
    }
}

// Ao carregar, destaca o avatar salvo
firebase.auth().onAuthStateChanged(async user => {
    if (!user) return;
    const doc = await firebase.firestore().collection('clientes').doc(user.uid).get();
    if (doc.exists) {
        const dados = doc.data();
        if (dados.fotoPerfilUrl) {
            document.getElementById('foto-perfil').src = dados.fotoPerfilUrl;
            document.querySelectorAll('.avatar-opcao').forEach(img => {
                if (img.src.includes(dados.fotoPerfilUrl)) img.classList.add('selected');
            });
        }
    }
});

function confirmarSaida() {
    if (confirm("Salve seus dados antes de sair!\nTem certeza que deseja sair agora?")) {
        logout();
    }
}

