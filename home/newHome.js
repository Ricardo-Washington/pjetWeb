// Verifica se o Firebase está carregado e usuário autenticado
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        findTransactions(user);
    } else {
        window.location.href = "/login/login.html";
    }
});

// Função para formatar a data para o padrão brasileiro
function formatarDataBR(dataISO) {
    if (!dataISO) return '';
    const partes = dataISO.split('-');
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataISO;
}



// Chama a função ao carregar a página
firebase.auth().onAuthStateChanged(user => {
    if (user) carregarAgendamentosUsuario();
});

// Funções para formatar a data 
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}
// Funções para formatar o dinheiro
function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}

// Função para verificar se o usuário está logado
firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "/login/login.html";
    }
})

// Função para fazer logout
function logout() {
    console.log('Tentando deslogar...');
    if (typeof firebase === 'undefined' || !firebase.auth) {
        alert('Firebase não está carregado corretamente!');
        return;
    }
    firebase.auth().signOut()
        .then(() => {
            window.location.href = "/login/login.html";
        })
        .catch((error) => {
            alert('Erro de logout!');
            console.error('Erro ao deslogar:', error);
        });
}

// Função para formatar a data para o padrão brasileiro
function formatarDataBR(dataISO) {
    if (!dataISO) return '';
    const partes = dataISO.split('-');
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataISO;
}

// Busca e exibe os agendamentos do usuário logado, separando futuros e passados
async function carregarAgendamentosUsuario() { 
    const user = firebase.auth().currentUser;
    if (!user) return;

    const listaProximos = document.getElementById('proximos');
    const listaHistorico = document.getElementById('historico');
    if (!listaProximos || !listaHistorico) return;
    listaProximos.innerHTML = '';
    listaHistorico.innerHTML = '';

    const snapshot = await firebase.firestore().collection('agendamentos')
        .where('userId', '==', user.uid)
        .orderBy('data', 'asc')
        .get();

    const hoje = new Date();
    hoje.setHours(0,0,0,0); // Zera horas para comparar só a data

    let temProximos = false;
    let temHistorico = false;

    snapshot.forEach(doc => {
        const agendamento = doc.data();
        const dataAg = agendamento.data;
        // Espera formato yyyy-mm-dd
        const partes = dataAg ? dataAg.split('-') : [];
        const dataObj = partes.length === 3 ? new Date(partes[0], partes[1] - 1, partes[2]) : null;

        const li = document.createElement('li');
        li.className = 'appointment-item';
        li.innerHTML = `
            <div class="appointment-info">
                <h4>${agendamento.servico || ''}</h4>
                <p><i class="far fa-calendar-alt"></i> ${formatarDataBR(agendamento.data) || ''} - ${agendamento.horario || ''}</p>
                <p>Barbeiro: ${agendamento.barbeiro || ''}</p>
            </div>
            <span class="appointment-status status-pending">${agendamento.status || 'pendente'}</span>
        `;
        // alert removido ou ajustado
        if (dataObj && dataObj >= hoje) {
            listaProximos.appendChild(li);
            temProximos = true;
        } else {
            listaHistorico.appendChild(li);
            temHistorico = true;
        }
    });

    if (!temProximos) listaProximos.innerHTML = '<li>Nenhum agendamento futuro encontrado.</li>';
    if (!temHistorico) listaHistorico.innerHTML = '<li>Nenhum agendamento antigo encontrado.</li>';
}


