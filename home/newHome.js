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
function findTransactions(){
    firebase.firestore().collection('transactions').get().then(snapshot => {
       snapshot.docs.forEach(doc => {
        const transactions = snapshot.docs.map(doc => doc.data());
        addTransactionsToScreen(transactions)
        selectTransactionsToScreen(transactions)
       })
    })
}



// Produtos em destaque (use os mesmos nomes e preços do HTML)
const produtos = [
    { nome: "Pomada Modeladora", preco: 45.90 },
    { nome: "Óleo para Barba", preco: 39.90 },
    { nome: "Shampoo Antiqueda", preco: 59.90 },
    { nome: "Óleo para cabelos", preco: 80.90 }
];

let carrinho = [];

// Função para abrir o modal do carrinho
function abrirCarrinho() {
    mostrarOpcoesProdutos();
    atualizarCarrinho();
    document.getElementById('modal-carrinho').style.display = 'flex';
    document.getElementById('qrcode-area').innerHTML = '';
}

// Mostra as opções de produtos no modal
function mostrarOpcoesProdutos() {
    const opcoesDiv = document.getElementById('produtos-opcoes');
    opcoesDiv.innerHTML = '<strong>Adicionar produto:</strong><br>';
    produtos.forEach((prod, idx) => {
        const btn = document.createElement('button');
        btn.textContent = `${prod.nome} - R$ ${prod.preco.toFixed(2)}`;
        btn.className = 'btn btn-primary';
        btn.style.margin = '5px 5px 5px 0';
        btn.onclick = () => {
            adicionarAoCarrinho(prod);
        };
        opcoesDiv.appendChild(btn);
    });
}

// Função para fechar o modal do carrinho
document.getElementById('btn-fechar-carrinho').onclick = function() {
    document.getElementById('modal-carrinho').style.display = 'none';
    document.getElementById('qrcode-area').innerHTML = '';
};

// Adiciona produto ao carrinho
function adicionarAoCarrinho(produto) {
    carrinho.push(produto);
    abrirCarrinho();
}

// Remove produto do carrinho
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

// Atualiza a lista e o total do carrinho
function atualizarCarrinho() {
    const lista = document.getElementById('carrinho-lista');
    const total = document.getElementById('carrinho-total');
    lista.innerHTML = '';
    let soma = 0;
    carrinho.forEach((prod, idx) => {
        soma += prod.preco;
        const li = document.createElement('li');
        li.innerHTML = `
            ${prod.nome} - R$ ${prod.preco.toFixed(2)}
            <button style="margin-left:10px; color:red; border:none; background:none; cursor:pointer;" onclick="removerDoCarrinho(${idx})">Remover</button>
        `;
        lista.appendChild(li);
    });
    total.textContent = soma.toFixed(2);
}

// Gera o QR Code do valor total
document.getElementById('btn-gerar-qrcode').onclick = function() {
    const total = carrinho.reduce((acc, prod) => acc + prod.preco, 0);
    if (total === 0) {
        alert('Adicione produtos ao carrinho!');
        return;
    }
    // Exemplo: o QR pode ser um texto com o valor, ou um link de pagamento real
    const qr = new QRious({
        element: document.createElement('canvas'),
        value: `Pagamento RightCut - Total: R$ ${total.toFixed(2)}`,
        size: 180
    });
    const area = document.getElementById('qrcode-area');
    area.innerHTML = '';
    area.appendChild(qr.element);
};

// Adiciona eventos aos botões "Comprar"
document.querySelectorAll('.product-btn').forEach((btn, idx) => {
    btn.onclick = () => adicionarAoCarrinho(produtos[idx]);
});

// Permite remover do carrinho (função global)
window.removerDoCarrinho = removerDoCarrinho;

document.getElementById('modal-carrinho').addEventListener('click', function(event) {
    if (event.target === this) {
        this.style.display = 'none';
        document.getElementById('qrcode-area').innerHTML = '';
    }
});