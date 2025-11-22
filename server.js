const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Middleware para servir arquivos estáticos (html, css, js do frontend)
app.use(express.static(__dirname));

// Função auxiliar para ler os dados do arquivo JSON
const readData = async () => {
    try {
        const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // Se o arquivo não existir ou tiver erro, retorna uma estrutura padrão
        console.error("Erro ao ler data.json, retornando estrutura padrão:", error);
        return { messages: {}, visitors: [] };
    }
};

// Função auxiliar para escrever os dados no arquivo JSON
const writeData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

// --- ROTAS DA API ---

// Rota para obter todos os visitantes
app.get('/api/visitors', async (req, res) => {
    const data = await readData();
    res.json(data.visitors);
});

// Rota para obter as mensagens
app.get('/api/messages', async (req, res) => {
    const data = await readData();
    res.json(data.messages);
});

// Rota para adicionar um novo visitante
app.post('/api/visitors', async (req, res) => {
    const data = await readData();
    const newVisitor = req.body;

    // Gera um ID simples (em uma aplicação real, usar UUID seria melhor)
    newVisitor.id = Date.now();
    
    data.visitors.push(newVisitor);
    await writeData(data);

    res.status(201).json(newVisitor);
});

// Rota para atualizar um visitante existente
app.put('/api/visitors/:id', async (req, res) => {
    const visitorId = parseInt(req.params.id, 10);
    const updatedVisitorData = req.body;
    const data = await readData();

    const visitorIndex = data.visitors.findIndex(v => v.id === visitorId);

    if (visitorIndex === -1) {
        return res.status(404).json({ message: 'Visitante não encontrado' });
    }

    // Atualiza o visitante mantendo o ID original
    data.visitors[visitorIndex] = { ...data.visitors[visitorIndex], ...updatedVisitorData };
    
    await writeData(data);

    res.json(data.visitors[visitorIndex]);
});

// Rota para deletar um visitante
app.delete('/api/visitors/:id', async (req, res) => {
    const visitorId = parseInt(req.params.id, 10);
    const data = await readData();

    const initialLength = data.visitors.length;
    data.visitors = data.visitors.filter(v => v.id !== visitorId);

    if (data.visitors.length === initialLength) {
        return res.status(404).json({ message: 'Visitante não encontrado' });
    }

    await writeData(data);
    res.status(204).send(); // 204 No Content
});


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});