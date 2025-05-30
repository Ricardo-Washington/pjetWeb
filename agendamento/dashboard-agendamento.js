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
    // Exibe os agendamentosdo usuário
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
        li.querySelector('.btn-edit').addEventListener('click', () => {
        abrirModalEditar(agendamento, agendamentoId);
    });
        lista.appendChild(li);
    });

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

// Função para formatar a data para o padrão brasileiro
function formatarDataBR(dataISO) {
    if (!dataISO) return '';
    // Se vier no formato xxxx-xx-xx
    const partes = dataISO.split('-');
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataISO;
}



// comando do modal de edição
let agendamentoEditandoId = null;
let agendamentoEditandoBarbeiro = null;

// Função para abrir o modal de edição
function abrirModalEditar(agendamento, agendamentoId) {
    agendamentoEditandoId = agendamentoId;
    agendamentoEditandoBarbeiro = agendamento.barbeiro;
    document.getElementById('editar-servico').value = agendamento.servico;
    document.getElementById('editar-data').value = agendamento.data;
    carregarHorariosEdicao(agendamento.data, agendamento.horario);
    document.getElementById('modal-editar-agendamento').style.display = 'flex';
}

// Carrega horários disponíveis para o modal de edição
async function carregarHorariosEdicao(data, horarioAtual) {
    const horariosBase = [
        '09:00', '09:30', '10:00', '10:30', '11:00',
        '14:00', '14:30', '15:00', '15:30', '16:00'
    ];
    if (!data || !agendamentoEditandoBarbeiro) {
        document.getElementById('editar-horario').innerHTML = '<option value="">Selecione a data primeiro</option>';
        return;
    }
    const snapshot = await firebase.firestore().collection('agendamentos')
        .where('barbeiro', '==', agendamentoEditandoBarbeiro)
        .where('data', '==', data)
        .get();
    const agendados = snapshot.docs.map(doc => doc.data().horario);
    // Inclui o horário atual do agendamento em edição
    const horariosDisponiveis = horariosBase.filter(h => !agendados.includes(h) || h === horarioAtual);
    let html = '';
    horariosDisponiveis.forEach(h => {
        html += `<option value="${h}">${h}</option>`;
    });
    document.getElementById('editar-horario').innerHTML = html;
    document.getElementById('editar-horario').value = horarioAtual;
}

// Fecha o modal
document.getElementById('btn-cancelar-edicao').onclick = () => {
    document.getElementById('modal-editar-agendamento').style.display = 'none';
    agendamentoEditandoId = null;
    agendamentoEditandoBarbeiro = null;
};

// Atualiza horários ao mudar a data no modal
document.getElementById('editar-data').addEventListener('change', function() {
    carregarHorariosEdicao(this.value, null);
});

// Salva a edição
document.getElementById('form-editar-agendamento').onsubmit = async function(e) {
    e.preventDefault();
    if (!agendamentoEditandoId) return;
    const novoServico = document.getElementById('editar-servico').value;
    const novaData = document.getElementById('editar-data').value;
    const novoHorario = document.getElementById('editar-horario').value;
    // Verifica se já existe agendamento para o mesmo barbeiro, data e horário
    const snapshot = await firebase.firestore().collection('agendamentos')
        .where('barbeiro', '==', agendamentoEditandoBarbeiro)
        .where('data', '==', novaData)
        .where('horario', '==', novoHorario)
        .get();
    // Só permite se for o próprio agendamento ou se não houver conflito
    if (!snapshot.empty && snapshot.docs[0].id !== agendamentoEditandoId) {
        alert('Este horário já está ocupado! Escolha outro.');
        return;
    }
    await firebase.firestore().collection('agendamentos').doc(agendamentoEditandoId).update({
        servico: novoServico,
        data: novaData,
        horario: novoHorario
    });
    alert('Agendamento atualizado!');
    document.getElementById('modal-editar-agendamento').style.display = 'none';
    agendamentoEditandoId = null;
    agendamentoEditandoBarbeiro = null;
    carregarAgendamentosUsuario();
};

// Preços dos serviços
const precosServicos = {
    "corte-cabelo": 35.00,
    "barba": 25.00,
    "pintura": 50.00,
    "sobrancelha": 20.00,
    "progressiva": 80.00,
    "descolorir-cabelo": 90.00
};

// Atualiza o valor total
function atualizarValorTotal() {
    const servico = servicoSelect.value;
    let total = precosServicos[servico] || 0;
    document.querySelectorAll('#produtos-adicionais input[type="checkbox"]:checked').forEach(cb => {
        total += parseFloat(cb.getAttribute('data-preco'));
    });
    document.getElementById('valor-total-servico').textContent = total.toFixed(2);
    return total;
}

// Eventos para atualizar o valor total
servicoSelect.addEventListener('change', atualizarValorTotal);
document.querySelectorAll('#produtos-adicionais input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', atualizarValorTotal);
});

// Ao reservar, mostra o QR Code
bookAppointmentButton.addEventListener('click', async () => {
    // ...código de validação e cadastro...

    // Após cadastrar, gere o QR Code do valor total
    const total = atualizarValorTotal();
    const qr = new QRious({
        element: document.createElement('canvas'),
        value: `Pagamento RightCut - Total: R$ ${total.toFixed(2)}`,
        size: 180
    });
    const area = document.getElementById('qrcode-area-pagamento');
    area.innerHTML = '';
    area.appendChild(qr.element);
    document.getElementById('modal-qrcode').style.display = 'flex';
});

// Fecha o modal do QR Code
document.getElementById('btn-fechar-qrcode').onclick = function() {
    document.getElementById('modal-qrcode').style.display = 'none';
};