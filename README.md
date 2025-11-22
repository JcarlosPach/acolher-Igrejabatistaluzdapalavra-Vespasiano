Acolher+ — Sistema Inteligente de Gestão de Visitantes para Igrejas

O Acolher+ é um sistema criado para modernizar e automatizar o processo de acolhimento, acompanhamento e integração de visitantes em igrejas.
Ele oferece uma solução completa para registrar visitantes, organizar o follow-up pastoral, enviar mensagens automáticas e monitorar a jornada de engajamento de cada pessoa.

📌 Objetivo do Projeto

Desenvolver uma plataforma capaz de centralizar todas as informações de visitantes, oferecer acompanhamento inteligente, automatizar envio de mensagens, e reduzir a perda de pessoas que chegam à igreja mas não recebem acompanhamento adequado devido ao alto fluxo e falta de gestão apropriada.

✨ Funcionalidades Principais
1. Cadastro Inteligente de Visitantes

Registro via formulário web ou QR Code

Dados coletados: contato, endereço, frequência, histórico

Possibilidade de integração com API WhatsApp, Telegram ou SMS

2. Automação de Mensagens

Envio automático após primeira visita

Fluxos personalizados: ausência, acompanhamento, integração

Registro detalhado: quem recebeu, quando recebeu e status da entrega

3. Dashboard de Acompanhamento

Indicadores visuais: novos visitantes, ausentes, frequência semanal

Filtros por bairro, tempo sem retorno, faixa etária, e mais

Alertas automáticos para visitantes não acompanhados

4. Gestão de Follow-up

Atribuição de responsáveis por visitante

Histórico de conversas e contatos

Mudança de status:
Novo → Em acompanhamento → Frequente → A integrar → Encerrado

5. Banco de Dados e Backend

Estrutura atual prevista: Firebase (Firestore ou Realtime Database)

API em Node.js (em evolução)

Suporte planejado para SQLite, PostgreSQL e MongoDB via camada modular

🛠️ Tecnologias Utilizadas (Atual / Futuras)
Camada	Tecnologia
Frontend	JavaScript / HTML / CSS (planejado: React ou Vue)
Backend	Node.js + Express
Banco	Firebase Firestore / SQLite
Autenticação	Firebase Auth (planejado)
Mensageria	WhatsApp Cloud API / Telegram Bot / Twilio (planejado)
QR Code	Biblioteca JS integrada
📈 Roadmap (Evolução do Projeto)
🔹 Fase Atual

Estruturação do backend

Definição do banco de dados

Criação dos primeiros fluxos de cadastro

🔜 Próximas Fases

Integração oficial com WhatsApp API

Dashboard completo com gráficos e métricas

Painel administrativo para acompanhamento

Sistema de permissões (liderança, discipuladores, admin)

App Mobile (React Native / Flutter)

👨‍💻 Procuramos Desenvolvedores

Este projeto busca colaboração de desenvolvedores para:

Backend

Organização e otimização da API

Regras de segurança, autenticação e perfis de usuário

Eventos automáticos (scheduled jobs)

Frontend

Construção de interface limpa e organizada

Dashboard com gráficos e tabelas

Fluxo de QR Code

Banco de Dados

Normalização e modelagem

Implementação de índices e regras de acesso

Automação de Mensagens

Conexão com WhatsApp Cloud API

Criação de fluxos inteligentes de atendimento

Se você trabalha com JavaScript, Node.js, Firebase, SQL, NoSQL, React, Vue, APIs REST — sua ajuda será muito bem-vinda.
📦 Como executar o projeto (versão inicial)
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/acolher-plus.git

# Entrar no diretório
cd acolher-plus

# Instalar dependências
npm install

# Executar servidor
node api.js


Conforme evoluirmos, adicionarei instruções completas para ambiente, variáveis, Firebase e integrações externas.

📁 Estrutura Inicial do Projeto
/acolher-plus
│
├── api/
│   ├── api.js
│   ├── database.js
│   ├── controllers/
│   ├── routes/
│   └── models/
│
├── public/
│   ├── index.html
│   └── qr.html
│
└── README.md

🔒 Segurança & Privacidade

Como o sistema trata dados pessoais, o projeto segue princípios de:

Minimização de dados

Criptografia de informações sensíveis

Controle de acesso por papéis

Logs e auditorias de ações

📢 Contribuição

Pull requests são bem-vindos. Para grandes alterações:

Abra uma issue descrevendo sua proposta

Justifique tecnicamente

Comente os impactos na arquitetura

Crie branch específica com seu nome

📄 Licença

Escolheremos a licença conforme maturidade do projeto (MIT ou GPL).
Atualmente, uso interno e apenas para fins de desenvolvimento.
