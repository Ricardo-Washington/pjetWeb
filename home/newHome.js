findTransactions();

// Função para adicionar transações na tela inicial
function findTransactions(){
    firebase.firestore().collection('transactions').get().then(snapshot => {
       snapshot.docs.forEach(doc => {
        const transactions = snapshot.docs.map(doc => doc.data());
        addTransactionsToScreen(transactions)
        selectTransactionsToScreen(transactions)
       })
    })
}
// Exemplo de transações para a tela inicial
function addTransactionsToScreen(newAgendamento) {
    
    const nextList = document.getElementById('proximos');

    newAgendamento.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add(transaction.type);

        const type = document.createElement('b');
        type.innerHTML = transaction.transactionType;
        li.appendChild(type);

        const money = document.createElement('p');
        money.innerHTML = formatMoney(transaction.money);
        li.appendChild(money);


        const date = document.createElement('a');
        date.innerHTML = formatDate(transaction.date);
        li.appendChild(date);

        const horario = document.createElement('a');
        horario.innerHTML = transaction.horario;
        li.appendChild(horario);

        const status = document.createElement('d');
        status.innerHTML = transaction.status;
        li.appendChild(status);

        
        nextList.appendChild(li);
    });
}

// Exemplo de transações para o histórico
function selectTransactionsToScreen(historyAgendamento) {
    const historyList = document.getElementById('historico');

    historyAgendamento.forEach(transaction1 => {
        const li = document.createElement('li');
        li.classList.add(transaction1.type);

        const type = document.createElement('b');
        type.innerHTML = transaction1.transactionType;
        li.appendChild(type);

        const money = document.createElement('p');
        money.innerHTML = formatMoney(transaction1.money);
        li.appendChild(money);

        const date = document.createElement('a');
        date.innerHTML = formatDate(transaction1.date);
        li.appendChild(date);

        const description = document.createElement('a');
        description.innerHTML = transaction1.description;
        li.appendChild(description);

        const status = document.createElement('d');
        status.innerHTML = transaction1.status;
        li.appendChild(status);
        
        historyList.appendChild(li);
    });
}

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