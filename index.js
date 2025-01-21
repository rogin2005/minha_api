const express = require('express');
const supabase = require('./supabase')

const app = express();
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});

app.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;

    const { data, error } = await supabase
        .from('usuarios')
        .insert([{ nome, email, senha }]);

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});

app.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*');

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const { data, error } = await supabase
        .from('usuarios')
        .update({ nome, email, senha })
        .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Usuário deletado com sucesso!' });
});