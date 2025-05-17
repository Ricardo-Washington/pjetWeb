// Simulação de dados do usuário
        const userName = "Ricardo";
        document.getElementById('user-greeting').textContent = `Olá, ${userName}!`;

        // Simulação de dados de agendamentos futuros
        const proximosAgendamentos = [
            { data: "2025-05-18", hora: "09:30", servico: "Corte Moderno" },
            { data: "2025-05-25", hora: "16:00", servico: "Barba e Bigode" }
        ];
        const proximosLista = document.getElementById('proximos-agendamentos');
        const nenhumProximo = document.getElementById('nenhum-proximo');

        if (proximosAgendamentos.length > 0) {
            proximosAgendamentos.forEach(agendamento => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <i class="far fa-calendar-alt"></i> ${formatarData(agendamento.data)} - ${agendamento.hora} - ${agendamento.servico}
                    <div class="actions">
                        <button class="button secondary small"><i class="fas fa-edit"></i></button>
                        <button class="button danger small"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                proximosLista.appendChild(listItem);
            });
        } else {
            nenhumProximo.style.display = 'block';
        }

        // Simulação de dados do histórico de agendamentos
        const historicoAgendamentos = [
            { data: "2025-04-10", hora: "15:00", servico: "Corte Clássico" },
            { data: "2025-04-28", hora: "11:30", servico: "Aparar Barba" }
        ];
        const historicoLista = document.getElementById('historico-agendamentos');
        const nenhumHistorico = document.getElementById('nenhum-historico');

        if (historicoAgendamentos.length > 0) {
            historicoAgendamentos.forEach(historico => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<i class="far fa-calendar-check"></i> ${formatarData(historico.data)} - ${historico.hora} - ${historico.servico}`;
                historicoLista.appendChild(listItem);
            });
        } else {
            nenhumHistorico.style.display = 'block';
        }

        function formatarData(dataString) {
            const data = new Date(dataString);
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }

        // Lógica do Modal de Agendamento
        const agendarBtnPrincipal = document.getElementById('agendar-btn-principal');
        const abrirAgendamentoSidebar = document.getElementById('abrir-agendamento-sidebar');
        const modal = document.getElementById('agendamento-modal');
        const closeButton = document.querySelector('.close-button');
        const agendamentoForm = document.getElementById('agendamento-form');

        const abrirModalAgendamento = () => {
            modal.style.display = 'block';
        };

        agendarBtnPrincipal.addEventListener('click', abrirModalAgendamento);
        abrirAgendamentoSidebar.addEventListener('click', abrirModalAgendamento);

        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        agendamentoForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = document.getElementById('data-agendamento').value;
            const hora = document.getElementById('hora-agendamento').value;
            const servico = document.getElementById('tipo-servico').value;
            alert(`Agendamento realizado para ${formatarData(data)} às ${hora} para o serviço de ${servico}! (Funcionalidade real seria implementada no backend)`);
            modal.style.display = 'none';
            agendamentoForm.reset();
            // Aqui você enviaria os dados do agendamento para o backend
        });