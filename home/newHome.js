

findTransactions();


function findTransactions(){
    setTimeout(() => {
        addTransactionsToScreen(fakeTransection);
    }, 1000)
}

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
    description:'11 hora'

},{
    type: 'pendente',
    date: '2025-07-03',
    money: {
        currency: 'R$',
        value: 20
    },
    transactionType:'barba',
    description:'9 hora'

},{
    type: 'realizado',
    date: '2023-08-10',
    money: {
        currency: 'R$',
        value: 10
    },
    transactionType:'corte + barba',
    description:'10 hora'

},{
    type: 'realizado',
    date: '2020-05-04',
    money: {
        currency: 'R$',
        value: 10
    },
    transactionType:'corte',
    description:'14 horas'

}]