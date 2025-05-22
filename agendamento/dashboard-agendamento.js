const dataInput = document.getElementById('data');
const horarioSelect = document.getElementById('horario');
const barbeiroSelect = document.getElementById('barbeiro');
const bookAppointmentButton = document.querySelector('.book-appointment-button');
const avisoHorario = document.querySelector('.aviso-horario');
const servicoSelect = document.getElementById('servico');

async function loadAvailableTimes(date) {
    const barbeiroId = barbeiroSelect.value;
    if (!date || !barbeiroId) {
        horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
        horarioSelect.disabled = true;
        avisoHorario.style.display = 'none';
        bookAppointmentButton.disabled = true;
        return;
    }

    // Horários base
    const horariosBase = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'];

    // Buscar horários já agendados no Firestore
    try {
        const snapshot = await firebase.firestore().collection('agendamentos')
            .where('barbeiro', '==', barbeiroId)
            .where('data', '==', date)
            .get();
        const agendados = snapshot.docs.map(doc => doc.data().horario);
        // Filtrar horários disponíveis
        const horariosDisponiveis = horariosBase.filter(horario => !agendados.includes(horario));

        horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
        if (horariosDisponiveis.length > 0) {
            horariosDisponiveis.forEach(horario => {
                const option = document.createElement('option');
                option.value = horario;
                option.textContent = horario;
                horarioSelect.appendChild(option);
            });
            horarioSelect.disabled = false;
            avisoHorario.style.display = 'none';
        } else {
            horarioSelect.disabled = true;
            avisoHorario.style.display = 'block';
        }
        bookAppointmentButton.disabled = true;
    } catch (error) {
        console.error('Erro ao buscar horários:', error);
        horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
        horarioSelect.disabled = true;
        avisoHorario.style.display = 'block';
        bookAppointmentButton.disabled = true;
    }
}

function checkBookingAvailability() {
    if (servicoSelect.value && barbeiroSelect.value && dataInput.value && horarioSelect.value) {
        bookAppointmentButton.disabled = false;
    } else {
        bookAppointmentButton.disabled = true;
    }
}

servicoSelect.addEventListener('change', checkBookingAvailability);
barbeiroSelect.addEventListener('change', () => {
    loadAvailableTimes(dataInput.value);
    checkBookingAvailability();
});
dataInput.addEventListener('change', () => {
    loadAvailableTimes(dataInput.value);
    checkBookingAvailability();
});
horarioSelect.addEventListener('change', checkBookingAvailability);

bookAppointmentButton.addEventListener('click', async () => {
    const servico = servicoSelect.value;
    const barbeiro = barbeiroSelect.value;
    const data = dataInput.value;
    const horario = horarioSelect.value;

    // Pega o usuário autenticado
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('Usuário não autenticado!');
        return;
    }

    try {
        await firebase.firestore().collection('agendamentos').add({
            servico,
            barbeiro,
            data,
            horario,
            userId: user.uid,
            status: 'pendente',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert('Reserva cadastrada com sucesso!');
        // Limpa o formulário
        servicoSelect.value = '';
        barbeiroSelect.value = '';
        dataInput.value = '';
        horarioSelect.value = '';
        bookAppointmentButton.disabled = true;
        loadAvailableTimes('');
    } catch (error) {
        alert('Erro ao cadastrar agendamento!');
        console.error(error);
    }
});

// Função para buscar e exibir agendamentos do usuário logado
function carregarAgendamentosUsuario() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    firebase.firestore().collection('agendamentos')
        .where('userId', '==', user.uid)
        .orderBy('data', 'desc')
        .get()
        .then(snapshot => {
            const agendamentos = snapshot.docs.map(doc => doc.data());
            exibirAgendamentos(agendamentos);
        })
        .catch(error => {
            console.error('Erro ao buscar agendamentos:', error);
        });
}

function exibirAgendamentos(agendamentos) {
    const lista = document.getElementById('proximos');
    lista.innerHTML = '';
    if (!agendamentos.length) {
        lista.innerHTML = '<li>Nenhum agendamento encontrado.</li>';
        return;
    }
    agendamentos.forEach(ag => {
        const li = document.createElement('li');
        li.className = 'appointment-item';
        li.innerHTML = `
            <div class="appointment-info">
                <h4>${ag.servico || ''}</h4>
                <p><i class="far fa-calendar-alt"></i> ${ag.data || ''} - ${ag.horario || ''}</p>
                <p>Barbeiro: ${ag.barbeiro || ''}</p>
            </div>
            <span class="appointment-status status-pending">${ag.status || 'pendente'}</span>
        `;
        lista.appendChild(li);
    });
}

// Chama a função ao carregar a página e ao cadastrar novo agendamento
firebase.auth().onAuthStateChanged(user => {
    if (user) carregarAgendamentosUsuario();
});


