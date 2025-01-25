const express = require('express');
const bcrypt = require('bcrypt');
const supabase = require('./supabase');

const app = express();
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});

app.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {

    const hashedPassword = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
        .from('usuarios')
        .insert([{ nome, email, senha: hashedPassword }]);
    
    if (error) throw error;
    
    res.status(201).json(data);
} catch (error) {
    res.status(400).json({ error: error.message });
}
});

app.get('/usuarios', async (req, res) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*');

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();  // O método .single() retorna um único objeto

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.get('/', (req, res) => {
    res.json({
        message: "Bem-vindo à API de Usuários!",
        endpoints: {
            "GET /usuarios": "Obtém todos os usuários",
            "POST /usuarios": "Cria um novo usuário",
            "PUT /usuarios/:id": "Atualiza um usuário",
            "DELETE /usuarios/:id": "Deleta um usuário"
        }
    });
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