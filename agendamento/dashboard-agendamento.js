const dataInput = document.getElementById('data');
const horarioSelect = document.getElementById('horario');
const barbeiroSelect = document.getElementById('barbeiro');
const bookAppointmentButton = document.querySelector('.book-appointment-button');
const avisoHorario = document.querySelector('.aviso-horario');
const servicoSelect = document.getElementById('servico');

// Habilita/desabilita botão conforme seleção
function checkBookingAvailability() {
    if (
        servicoSelect.value &&
        barbeiroSelect.value &&
        dataInput.value &&
        horarioSelect.value &&
        !horarioSelect.disabled
    ) {
        bookAppointmentButton.disabled = false;
    } else {
        bookAppointmentButton.disabled = true;
    }
}

// Carrega horários disponíveis do banco
async function loadAvailableTimes(date) {
    const barbeiroId = barbeiroSelect.value;
    if (!date || !barbeiroId) {
        horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
        horarioSelect.disabled = true;
        avisoHorario.style.display = 'none';
        bookAppointmentButton.disabled = true;
        return;
    }

    const horariosBase = [
        '09:00', '09:30', '10:00', '10:30', '11:00',
        '14:00', '14:30', '15:00', '15:30', '16:00'
    ];

    try {
        const snapshot = await firebase.firestore().collection('agendamentos')
            .where('barbeiro', '==', barbeiroId)
            .where('data', '==', date)
            .get();
        const agendados = snapshot.docs.map(doc => doc.data().horario);
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

// Evento para cadastrar agendamento com verificação de disponibilidade
bookAppointmentButton.addEventListener('click', async () => {
    const servico = servicoSelect.value;
    const barbeiro = barbeiroSelect.value;
    const data = dataInput.value;
    const horario = horarioSelect.value;
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('Usuário não autenticado!');
        return;
    }
    // Verifica se a data escolhida já passou
    const hoje = new Date();
    hoje.setHours(0,0,0,0); // Zera horas para comparar só a data
    const partesData = data.split('-');
    const dataSelecionada = new Date(partesData[0], partesData[1] - 1, partesData[2]);

    if (dataSelecionada < hoje) {
        alert('Não é possível agendar para uma data que já passou!');
        return;
    }
    try {
        // Verifica se já existe agendamento para o mesmo barbeiro, data e horário
        const snapshot = await firebase.firestore().collection('agendamentos')
            .where('barbeiro', '==', barbeiro)
            .where('data', '==', data)
            .where('horario', '==', horario)
            .get();

        if (!snapshot.empty) {
            alert('Este horário já está ocupado! Escolha outro.');
            return;
        }

        // Se não existe, pode cadastrar
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
        horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
        horarioSelect.disabled = true;
        bookAppointmentButton.disabled = true;
        avisoHorario.style.display = 'none';
        carregarAgendamentosUsuario();
    } catch (error) {
        alert('Erro ao cadastrar agendamento!');
        console.error(error);
    }
});

// Busca e exibe os agendamentos do usuário logado
async function carregarAgendamentosUsuario() { 
    const user = firebase.auth().currentUser;
    if (!user) return;

    const lista = document.getElementById('proximos');
    lista.innerHTML = '';

    const snapshot = await firebase.firestore().collection('agendamentos')
        .where('userId', '==', user.uid)
        .orderBy('data', 'asc')
        .get();

    if (snapshot.empty) {
        lista.innerHTML = '<li>Nenhum agendamento encontrado.</li>';
        return;
    }

    // ...código anterior...

snapshot.forEach(doc => {
    const agendamento = doc.data();
    const agendamentoId = doc.id;
    const li = document.createElement('li');
    li.className = 'appointment-item';
    li.innerHTML = `
        <div class="appointment-info">
            <h4>${agendamento.servico || ''}</h4>
            <p><i class="far fa-calendar-alt"></i> ${formatarDataBR(agendamento.data) || ''} - ${agendamento.horario || ''}</p>
            <p>Barbeiro: ${agendamento.barbeiro || ''}</p>
        </div>
        <span class="appointment-status status-pending">${agendamento.status || 'pendente'}</span>
        <div class="appointment-actions">
            <button class="btn-edit"><i class="fas fa-edit"></i> Editar</button>
            <button class="btn-cancel"><i class="fas fa-times"></i> Cancelar</button>
        </div>
    `;
    // Botão cancelar
    li.querySelector('.btn-cancel').addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            await firebase.firestore().collection('agendamentos').doc(agendamentoId).delete();
            alert('Agendamento cancelado!');
            carregarAgendamentosUsuario();
        }
    });
    // Botão editar
    li.querySelector('.btn-edit').addEventListener('click', async () => {
        const novoServico = prompt(
            'Novo serviço (ex: corte-cabelo, barba, sobrancelha, progressiva):',
            agendamento.servico
        );
        if (!novoServico) return;
        const novaData = prompt('Nova data (AAAA-MM-DD):', agendamento.data);
        if (!novaData) return;
        const novoHorario = prompt('Novo horário (ex: 09:00):', agendamento.horario);
        if (!novoHorario) return;
        // Verifica se já existe agendamento para o mesmo barbeiro, data e horário
        const snapshot = await firebase.firestore().collection('agendamentos')
            .where('barbeiro', '==', agendamento.barbeiro)
            .where('data', '==', novaData)
            .where('horario', '==', novoHorario)
            .get();
        if (!snapshot.empty) {
            alert('Este horário já está ocupado! Escolha outro.');
            return;
        }
        await firebase.firestore().collection('agendamentos').doc(agendamentoId).update({
            servico: novoServico,
            data: novaData,
            horario: novoHorario
        });
        alert('Agendamento atualizado!');
        carregarAgendamentosUsuario();
    });
    lista.appendChild(li);
});

// ...restante do código...
}

// Eventos para atualizar horários e botão
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

// Chama a função ao carregar a página
firebase.auth().onAuthStateChanged(user => {
    if (user) carregarAgendamentosUsuario();
});

// Buscar nome do usuário no Firestore e mostrar no canto superior direito
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        firebase.firestore().collection('usuarios').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    const nome = doc.data().nome || '';
                    document.getElementById('nome-cliente').textContent = nome;
                }
            });
    }
});

// Função para formatar a data para o padrão brasileiro
function formatarDataBR(dataISO) {
    if (!dataISO) return '';
    // Se vier no formato yyyy-mm-dd
    const partes = dataISO.split('-');
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataISO;
}