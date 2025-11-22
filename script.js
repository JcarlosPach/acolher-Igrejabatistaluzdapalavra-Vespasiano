// Aguarda o carregamento completo do HTML antes de executar o script
document.addEventListener('DOMContentLoaded', async () => { // Tornando a função async

    // --- SELETORES DE ELEMENTOS DA UI ---
    const visitorForm = document.getElementById('visitor-form');
    const visitorList = document.getElementById('visitor-list');
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const closeModalButton = document.querySelector('.close-button');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const mainTitle = document.getElementById('main-title');
    const newVisitorBtn = document.getElementById('new-visitor-btn');

    // --- ESTADO DA APLICAÇÃO ---
    // A lista de visitantes agora será carregada da API
    let messages = {};
    let visitors = [];

    // --- FUNÇÕES AUXILIARES ---

    // Mapeia os valores do status para textos mais amigáveis
    const statusMap = {
        nao_informado: 'Não Informado',
        em_acompanhamento: 'Em Acompanhamento',
        pretende_integrar: 'Pretende se Integrar',
        integrado: 'Integrado',
        apenas_visitando: 'Apenas Visitando',
    };

    /**
     * Formata uma string de data (YYYY-MM-DD) para o padrão brasileiro (dd/mm/yyyy).
     */
    const formatDate = (dateString) => {
        if (!dateString) return 'Não informada';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    // --- LÓGICA DE GRÁFICOS ---

    const renderCharts = () => {
        // 1. Gráfico de Presença (Novos visitantes por mês)
        const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
        const monthlyAttendance = Array(12).fill(0); // Array para os 12 meses

        visitors.forEach(visitor => {
            if (visitor.visitDate) {
                const month = new Date(visitor.visitDate).getMonth(); // 0 = Jan, 11 = Dez
                monthlyAttendance[month]++;
            }
        });

        if (attendanceChartInstance) {
            attendanceChartInstance.destroy(); // Destrói o gráfico anterior para recriá-lo
        }
        attendanceChartInstance = new Chart(attendanceCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Novos Visitantes',
                    data: monthlyAttendance,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                responsive: true,
                maintainAspectRatio: false,
                barPercentage: 0.5 // Deixa as barras mais finas (50% do espaço disponível)
            }
        });

        // 2. Gráfico de Status de Acompanhamento
        const statusCtx = document.getElementById('statusChart').getContext('2d');
        const statusCounts = { nao_informado: 0, pretende_integrar: 0, em_decisao: 0, apenas_visitando: 0 };

        visitors.forEach(visitor => {
            if (visitor.followUpStatus && statusCounts.hasOwnProperty(visitor.followUpStatus)) {
                statusCounts[visitor.followUpStatus]++;
            }
        });

        if (statusChartInstance) {
            statusChartInstance.destroy();
        }
        statusChartInstance = new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: Object.values(statusMap),
                datasets: [{
                    label: 'Status',
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        'rgba(149, 165, 166, 0.7)', // Não informado
                        'rgba(46, 204, 113, 0.7)',  // Pretende integrar
                        'rgba(241, 196, 15, 0.7)',   // Em decisão
                        'rgba(231, 76, 60, 0.7)'    // Apenas visitando
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    };

    // --- RENDERIZAÇÃO E MANIPULAÇÃO DO DOM ---

    /**
     * Função para renderizar (desenhar) a lista de visitantes na tela.
     */
    const renderVisitors = () => {
        // Limpa a lista atual para não duplicar itens
        visitorList.innerHTML = '';

        if (visitors.length === 0) {
            visitorList.innerHTML = '<p>Nenhum visitante cadastrado ainda.</p>';
            return;
        }

        // Para cada visitante na lista, cria um "card" com suas informações
        visitors.forEach(visitor => {
            const visitorCard = document.createElement('div');
            visitorCard.setAttribute('data-visitor-id', visitor.id);
            visitorCard.className = 'visitor-card';

            // Limpa o número de telefone para usar no link do WhatsApp
            const phoneForLink = visitor.phone.replace(/\D/g, '');
            const statusText = statusMap[visitor.followUpStatus] || 'Não Informado';

            visitorCard.innerHTML = `
                 <div class="details">
                     <h3>${visitor.name}</h3>
                     <p><strong>Telefone:</strong> ${visitor.phone}</p>
                     <p><strong>Data da Visita:</strong> ${formatDate(visitor.visitDate)}</p>
                     <p><strong>Primeiro Contato:</strong> ${formatDate(visitor.firstContactDate)}</p>
                     <p><strong>Status:</strong> ${statusText}</p>
                     <p><strong>Observações:</strong> ${visitor.notes || 'Nenhuma'}</p>
                 </div>
                 <div class="visitor-card-actions">
                     <a href="https://wa.me/55${phoneForLink}" class="whatsapp-btn action-btn" target="_blank">WhatsApp</a>
                     <button class="edit-btn action-btn" data-id="${visitor.id}">Editar</button>
                     <button class="delete-btn action-btn" data-id="${visitor.id}">Excluir</button>
                 </div>
            `;
            
            // Adiciona o card criado à lista na tela
            visitorList.appendChild(visitorCard);
        });
    };

    /**
     * Função para renderizar as mensagens na seção "Opções de Mensagens"
     */
    const renderMessages = () => {
        const messagesSection = document.getElementById('messages-section');
        // Limpa o conteúdo atual, exceto o título
        messagesSection.innerHTML = '<h2>Opções de Mensagens para Envio</h2>';

        // Cria um card para cada tipo de mensagem
        for (const key in messages) {
            const messageCard = document.createElement('div');
            messageCard.className = 'message-card'; // Usaremos essa classe para estilizar

            const messageText = messages[key];

            messageCard.innerHTML = `
                <h4>${key.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}</h4>
                <p>${messageText}</p>
                <button class="copy-btn action-btn" data-message-key="${key}">Copiar Texto</button>
            `;
            messagesSection.appendChild(messageCard);
        }
    };


    // --- EVENT LISTENERS ---

    // Adicionar novo visitante
    visitorForm.addEventListener('submit', async (event) => {
        // Impede o comportamento padrão do formulário de recarregar a página
        event.preventDefault();

        // Pega os valores dos campos do formulário
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const visitDate = document.getElementById('visit-date').value;
        const firstContactDate = document.getElementById('first-contact-date').value;
        const followUpStatus = document.getElementById('follow-up-status').value;
        const notes = document.getElementById('notes').value;

        // Cria um objeto para o novo visitante
        const newVisitor = {
            name,
            phone,
            visitDate,
            firstContactDate,
            followUpStatus,
            notes
        };

        try {
            const response = await fetch('/api/visitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVisitor)
            });
            const addedVisitor = await response.json();

            // Adiciona o novo visitante (com o ID do backend) ao início da lista local
            visitors.unshift(addedVisitor);

        } catch (error) {
            console.error('Erro ao adicionar visitante:', error);
            alert('Não foi possível adicionar o visitante. Tente novamente.');
            return;
        }
        // Atualiza a exibição da lista e dos gráficos
        renderVisitors();
        renderCharts();

        // Limpa os campos do formulário para o próximo cadastro
        visitorForm.reset();
    });

    // Ações na lista de visitantes (Editar/Excluir)
    visitorList.addEventListener('click', async (event) => {
        const target = event.target;
        // Converte o ID para número, pois o backend espera um número
        const visitorId = parseInt(target.dataset.id, 10);

        if (!visitorId) return;

        // Ação de Excluir
        if (target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja excluir este visitante?')) {
                try {
                    await fetch(`/api/visitors/${visitorId}`, { method: 'DELETE' });
                    // Remove da lista local e atualiza a tela
                    visitors = visitors.filter(v => v.id !== visitorId);
                    renderVisitors();
                    renderCharts();
                } catch (error) {
                    console.error('Erro ao excluir visitante:', error);
                    alert('Não foi possível excluir o visitante.');
                }
            }
        }

        // Ação de Editar
        if (target.classList.contains('edit-btn')) {
            const visitorToEdit = visitors.find(v => v.id === visitorId);
            if (visitorToEdit) {
                // Preenche o formulário do modal com os dados atuais
                document.getElementById('edit-visitor-id').value = visitorToEdit.id;
                document.getElementById('edit-name').value = visitorToEdit.name;
                document.getElementById('edit-phone').value = visitorToEdit.phone;
                document.getElementById('edit-visit-date').value = visitorToEdit.visitDate;
                document.getElementById('edit-first-contact-date').value = visitorToEdit.firstContactDate;
                document.getElementById('edit-follow-up-status').value = visitorToEdit.followUpStatus;
                // Exibe o modal
                editModal.style.display = 'block';
            }
        }
    });

    // Salvar alterações do modal de edição
    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const visitorId = parseInt(document.getElementById('edit-visitor-id').value, 10);

        const updatedData = {
            name: document.getElementById('edit-name').value,
            phone: document.getElementById('edit-phone').value,
            visitDate: document.getElementById('edit-visit-date').value,
            firstContactDate: document.getElementById('edit-first-contact-date').value,
            followUpStatus: document.getElementById('edit-follow-up-status').value,
        };

        try {
            const response = await fetch(`/api/visitors/${visitorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            const updatedVisitor = await response.json();

            // Atualiza o visitante na lista local
            const visitorIndex = visitors.findIndex(v => v.id === visitorId);
            if (visitorIndex > -1) {
                visitors[visitorIndex] = updatedVisitor;
            }

            renderVisitors();
            renderCharts();
            editModal.style.display = 'none';
        } catch (error) {
            console.error('Erro ao atualizar visitante:', error);
            alert('Não foi possível atualizar o visitante.');
        }
    });

    // Fechar o modal
    closeModalButton.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    });

    // --- LÓGICA DE NAVEGAÇÃO ---

    const handleSectionChange = (targetSectionId) => {
        // Esconde todas as seções
        contentSections.forEach(section => section.classList.remove('active'));
        // Remove a classe 'active' de todos os links
        navLinks.forEach(link => link.classList.remove('active'));

        // Mostra a seção alvo
        const sectionToShow = document.getElementById(targetSectionId);
        if (sectionToShow) {
            sectionToShow.classList.add('active');
        }

        // Ativa o link correspondente e atualiza o título
        const activeLink = document.querySelector(`.nav-link[data-section="${targetSectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            mainTitle.textContent = activeLink.querySelector('span').textContent;
        }
    };

    // Adiciona evento de clique para os links da navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o link de navegar para '#'
            const targetSectionId = link.dataset.section;
            handleSectionChange(targetSectionId);
        });
    });

    // Adiciona evento de clique para o botão "Novo Cadastro" no header
    newVisitorBtn.addEventListener('click', () => {
        handleSectionChange('form-section');
    });


    // --- INICIALIZAÇÃO ---
    const initializeApp = async () => {
        try {
            // Busca visitantes e mensagens em paralelo para otimizar o carregamento
            const [visitorsResponse, messagesResponse] = await Promise.all([
                fetch('/api/visitors'),
                fetch('/api/messages')
            ]);

            visitors = await visitorsResponse.json();
            messages = await messagesResponse.json();

            // Renderiza a lista e os gráficos iniciais ao carregar a página
            renderVisitors();
            renderCharts();
            renderMessages(); // Renderiza as mensagens

            // Define a seção inicial como Dashboard
            handleSectionChange('dashboard-section');

        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            visitorList.innerHTML = '<p style="color: red;">Erro ao carregar os dados do servidor.</p>';
        }
    };

    // Inicia a aplicação
    initializeApp();
});