const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const port = 3000;
const DB_FILE = './db.json';

app.use(express.json());

const readDB = async () => {
    try {
        const content = await fs.readFile(DB_FILE, 'utf8');
        return content ? JSON.parse(content) : {};
    } catch (e) {
        if (e.code === 'ENOENT') return {};
        throw e;
    }
};
const writeDB = async (data) => fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));

const handleRequest = (handler) => async (req, res) => {
    try {
        const result = await handler(req);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error(error.message);
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/setup', (req, res) => {
    res.sendFile(path.join(__dirname, 'config.html'));
});

app.get('/conf/:authToken', (req, res) => {
    res.sendFile(path.join(__dirname, 'config.html'));
});

app.post('/conf/:authToken/save-configs', handleRequest(async (req) => {
    const { authToken } = req.params;
    const { configs } = req.body;
    if (!Array.isArray(configs)) throw { status: 400, message: 'Data configs tidak valid. Harus berupa array.' };
    const db = await readDB();
    if (!db[authToken]) db[authToken] = {};
    db[authToken].configs = configs;
    await writeDB(db);
    return { message: 'Configs berhasil disimpan.' };
}));

app.post('/conf/:authToken/save-auto-post-state', handleRequest(async (req) => {
    const { authToken } = req.params;
    const { state } = req.body;

    if (!['started', 'stopped'].includes(state)) {
        throw { status: 400, message: 'Invalid state' };
    }

    const db = await readDB();
    if (!db[authToken]) db[authToken] = {};
    db[authToken].autoPostState = state;

    await writeDB(db);
    return { message: 'Auto-post state saved successfully.' };
}));

app.post('/save-auth-token', handleRequest(async (req) => {
    const { authToken } = req.body;
    if (!authToken) throw { status: 400, message: 'Auth token tidak boleh kosong.' };
    const db = await readDB();
    if (!db[authToken]) db[authToken] = {};
    await writeDB(db);
    return { message: 'Auth token berhasil disimpan.' };
}));

app.get('/conf/:authToken/load-configs', handleRequest(async (req) => {
    const { authToken } = req.params;
    const db = await readDB();
    const configs = db[authToken]?.configs || [];
    const autoPostState = db[authToken]?.autoPostState || 'stopped';
    return { configs, autoPostState };
}));

app.post('/check-token', handleRequest(async (req) => {
    const { token } = req.body;
    if (!token) throw { status: 400, message: 'Token kosong' };
    const resp = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { 'Authorization': token }
    });
    if (resp.ok) {
        const user = await resp.json();
        return { valid: true, username: user.username };
    }
    return { valid: false };
}));

app.post('/save-configs', handleRequest(async (req) => {
    const { token, configs } = req.body;
    if (!token) throw { status: 400, message: 'Token kosong' };
    if (!Array.isArray(configs)) throw { status: 400, message: 'Data configs tidak valid. Harus berupa array.' };
    const db = await readDB();
    if (!db[token]) db[token] = {};
    db[token].configs = configs;
    await writeDB(db);
    return { message: 'Configs berhasil disimpan.' };
}));

app.get('/load-configs', handleRequest(async (req) => {
    const token = req.query.token;
    if (!token) throw { status: 400, message: 'Token kosong' };
    const db = await readDB();
    const configs = db[token]?.configs || [];
    const autoPostState = db[token]?.autoPostState || 'stopped';
    return { configs, autoPostState };
}));

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));