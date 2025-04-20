const dataInput = document.getElementById('data');
const horarioSelect = document.getElementById('horario');
const barbeiroSelect = document.getElementById('barbeiro');
const bookAppointmentButton = document.querySelector('.book-appointment-button');
const avisoHorario = document.querySelector('.aviso-horario');
const servicoSelect = document.getElementById('servico');

function loadAvailableTimes(date) {
    const barbeiroId = barbeiroSelect.value;
    if (!date || !barbeiroId) {
        horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
        horarioSelect.disabled = true;
        avisoHorario.style.display = 'none';
        bookAppointmentButton.disabled = true;
        return;
    }

    // *** SIMULAÇÃO DE BUSCA DE HORÁRIOS DISPONÍVEIS (BACK-END LÓGICA REAL) ***
    // Em um cenário real, você faria uma requisição AJAX para o seu servidor
    // para obter os horários disponíveis para a data e barbeiro selecionados.
    const horariosDisponiveisSimulacao = getAvailableTimesSimulation(date, barbeiroId);

    horarioSelect.innerHTML = '<option value="">Selecione o horário</option>';
    if (horariosDisponiveisSimulacao.length > 0) {
        horariosDisponiveisSimulacao.forEach(horario => {
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
    bookAppointmentButton.disabled = true; // Habilitar ao selecionar um horário válido
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

bookAppointmentButton.addEventListener('click', () => {
    const servico = servicoSelect.value;
    const barbeiro = barbeiroSelect.value;
    const data = dataInput.value;
    const horario = horarioSelect.value;

    // *** AQUI VOCÊ IMPLEMENTARIA A LÓGICA PARA ENVIAR A RESERVA PARA O SEU SERVIDOR ***
    console.log('Reserva Solicitada:', { servico, barbeiro, data, horario });
    alert('Reserva solicitada com sucesso!');
    // Após a reserva bem-sucedida, você pode limpar o formulário ou redirecionar o cliente.
    document.getElementById('servico').value = '';
    document.getElementById('barbeiro').value = '';
    document.getElementById('data').value = '';
    document.getElementById('horario').value = '';
    bookAppointmentButton.disabled = true;
    loadAvailableTimes(''); // Limpar horários
});

// *** FUNÇÃO DE SIMULAÇÃO DE HORÁRIOS DISPONÍVEIS (SUBSTITUIR PELA LÓGICA DO BACK-END) ***
function getAvailableTimesSimulation(date, barbeiroId) {
    const horariosBase = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'];
    const horariosFiltrados = horariosBase.filter(horario => {
        // *** AQUI VOCÊ IMPLEMENTARIA A LÓGICA REAL DE VERIFICAÇÃO DE DISPONIBILIDADE ***
        // Isso envolveria consultar seu banco de dados para ver se o horário está ocupado
        // para a data e barbeiro selecionados.
        // Para esta simulação, vamos retornar alguns horários aleatoriamente.
        return Math.random() > 0.4;
    });
    return horariosFiltrados;
}
