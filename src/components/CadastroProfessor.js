import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';
import './Cadastro.css'; // Importando o arquivo CSS

const CadastroProfessor = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [especializacao, setEspecializacao] = useState('');
    const [senha, setSenha] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackClass, setFeedbackClass] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !email || !especializacao || !senha) {
            setFeedback('Todos os campos são obrigatórios.');
            setFeedbackClass('error');
            return;
        }

        try {
            const novoProfessor = {
                nome,
                email,
                especializacao,
                senha,
                userType: 'professor', // Adiciona o tipo de usuário
            };

            // Referência ao nó "professores" no banco de dados
            const professoresRef = ref(database, 'professores');

            // Salva no Firebase
            await push(professoresRef, novoProfessor);

            // Limpa o formulário e exibe mensagem de sucesso
            setNome('');
            setEmail('');
            setEspecializacao('');
            setSenha('');
            setFeedback('Cadastro de professor realizado com sucesso!');
            setFeedbackClass('success');
        } catch (error) {
            console.error('Erro ao cadastrar professor: ', error);
            setFeedback('Ocorreu um erro ao cadastrar o professor.');
            setFeedbackClass('error');
        }
    };

    return (
        <div className="cadastro-container">
            <div className="cadastro-form">
                <h2 className="cadastro-title">Cadastro de Professor</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <label>E-mail:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Especialização:</label>
                    <input
                        type="text"
                        value={especializacao}
                        onChange={(e) => setEspecializacao(e.target.value)}
                    />
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <button type="submit">Cadastrar</button>
                </form>

                {feedback && (
                    <p className={`feedback ${feedbackClass}`}>{feedback}</p>
                )}
            </div>
        </div>
    );
};

export default CadastroProfessor;
