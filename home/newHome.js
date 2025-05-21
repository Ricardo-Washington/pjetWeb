

findTransactions();


function findTransactions(){
    setTimeout(() => {
        addTransactionsToScreen(fakeTransection);
    }, 1000)
}
/* Exemplo!!
function addTransactionsToScreen(transactions) {
    
    const orderedList = document.getElementById('tranzacao');

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add(transaction.type);

        const date = document.createElement('p');
        date.innerHTML = formatDate(transaction.date);
        li.appendChild(date);

        const money = document.createElement('p');
        money.innerHTML = formatMoney(transaction.money);
        li.appendChild(money);

        const type = document.createElement('p');
        type.innerHTML = transaction.transactionType;
        li.appendChild(type);

        if (transaction.description) {
            const description = document.createElement('p');
            description.innerHTML = transaction.description;
            li.appendChild(description);
        }

        orderedList.appendChild(li);
    });
}
    */



function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}


function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}


const fakeTransection = [{
    type: 'realizado',
    date: '2020-05-04',
    money: {
        currency: 'R$',
        value: 10
    },
    transactionType:'corte',
    description:' - 11:30',
    status: 'pendente'

},{
    type: 'pendente',
    date: '2025-07-03',
    money: {
        currency: 'R$',
        value: 20
    },
    transactionType:'barba',
    description:' - 9:30',
    status: 'pendente'

},{
    type: 'realizado',
    date: '2023-08-10',
    money: {
        currency: 'R$',
        value: 10
    },
    transactionType:'corte + barba',
    description:' - 10:30',
    status: 'pendente'

},{
    type: 'realizado',
    date: '2020-05-04',
    money: {
        currency: 'R$',
        value: 10
    },
    transactionType:'corte',
    description:' - 14:30',
    status: 'pendente'

}]

function addTransactionsToScreen(newAgendamento) {
    
    const nextList = document.getElementById('proximos');

    newAgendamento.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add(transaction.type);

        const type = document.createElement('p');
        type.innerHTML = transaction.transactionType;
        li.appendChild(type);

        const date = document.createElement('a');
        date.innerHTML = formatDate(transaction.date);
        li.appendChild(date);

        const description = document.createElement('a');
        description.innerHTML = transaction.description;
        li.appendChild(description);

        const status = document.createElement('d');
        status.innerHTML = transaction.status;
        li.appendChild(status);

        const money = document.createElement('p');
        money.innerHTML = formatMoney(transaction.money);
        li.appendChild(money);


        nextList.appendChild(li);
    });
}