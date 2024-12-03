// src/components/CadastroUsuario.js

import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';
import './Cadastro.css';

const CadastroUsuario = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !email || !senha) {
            setFeedback("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const novoUsuario = {
                nome,
                email,
                turma: null, // Define a turma como null inicialmente
                senha, // Armazena a senha no banco de dados
                coins: 0 // Inicia com zero coins
            };

            // Referência ao nó "usuarios" no banco de dados
            const usuariosRef = ref(database, 'usuarios');

            // Salva no Firebase
            await push(usuariosRef, novoUsuario);

            // Limpa o formulário e exibe mensagem de sucesso
            setNome('');
            setEmail('');
            setSenha('');
            setFeedback("Cadastro realizado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar usuário: ", error);
            setFeedback("Ocorreu um erro ao cadastrar o usuário.");
        }
    };

    return (
        <div className="cadastro-container">
            <form className="cadastro-form" onSubmit={handleSubmit}>
                <h2 className="cadastro-title">Cadastro de Usuário</h2>
                
                <label>
                    Nome:
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </label>

                <label>
                    E-mail:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label>
                    Senha:
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </label>

                <button type="submit">Cadastrar</button>

                {feedback && (
                    <p className={`feedback ${feedback.includes("sucesso") ? "success" : "error"}`}>
                        {feedback}
                    </p>
                )}
            </form>
        </div>
    );
};

export default CadastroUsuario;
