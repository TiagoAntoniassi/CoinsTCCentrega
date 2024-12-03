import React, { useState, useEffect, useContext } from 'react';
import { database } from '../firebase';
import { ref, onValue, update } from 'firebase/database';
import { AuthContext } from '../context/AuthContext';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Ícones para marcar como concluída ou pendente
import './TarefasAluno.css';

const TarefasAluno = () => {
    const { userEmail, userType } = useContext(AuthContext);
    const [tarefas, setTarefas] = useState([]);
    const [resposta, setResposta] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca

    // Carregar todas as tarefas
    useEffect(() => {
        const tarefasRef = ref(database, 'tarefas');
        onValue(tarefasRef, (snapshot) => {
            const tarefasData = [];
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                tarefasData.push({ id: childSnapshot.key, ...data });
            });
            setTarefas(tarefasData);
            setLoading(false);
        });
    }, []);

    const handleToggleCompletion = async (id, estadoAtual) => {
        try {
            const tarefaRef = ref(database, `tarefas/${id}`);
            await update(tarefaRef, { concluida: !estadoAtual });
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    };

    const handleAddResposta = async (id) => {
        if (!resposta) {
            setFeedback('Adicione uma resposta antes de enviar.');
            return;
        }

        try {
            const tarefaRespostaRef = ref(database, `tarefas/${id}/respostas/${userEmail.replace(/\./g, '_')}`);
            await update(tarefaRespostaRef, { resposta });

            setFeedback('Resposta enviada com sucesso!');
            setResposta('');
        } catch (error) {
            console.error('Erro ao enviar resposta:', error);
            setFeedback('Erro ao enviar resposta. Tente novamente.');
        }
    };

    // Filtrar tarefas com base no termo de busca
    const tarefasFiltradas = tarefas.filter((tarefa) =>
        tarefa.nomeTarefa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (userType !== 'usuario') return null;

    return (
        <div className="tarefas-aluno-container">
            <h2>Tarefas Atribuídas</h2>
            <input
                type="text"
                placeholder="Buscar tarefa pelo nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />

            {tarefasFiltradas.length === 0 ? (
                <p>Nenhuma tarefa encontrada.</p>
            ) : (
                tarefasFiltradas.map((tarefa) => (
                    <div key={tarefa.id} className="tarefa-item">
                        <h3>{tarefa.nomeTarefa}</h3>
                        <p><strong>Descrição:</strong> {tarefa.descricao}</p>
                        <p><strong>Estado:</strong> {tarefa.concluida ? 'Concluída' : 'Pendente'}</p>

                        <button
                            onClick={() => handleToggleCompletion(tarefa.id, tarefa.concluida)}
                            className={tarefa.concluida ? 'button-pendente' : 'button-concluir'}
                        >
                            {tarefa.concluida ? <FaTimesCircle /> : <FaCheckCircle />}
                            {tarefa.concluida ? 'Marcar como Pendente' : 'Marcar como Concluída'}
                        </button>

                        <textarea
                            value={resposta}
                            onChange={(e) => setResposta(e.target.value)}
                            placeholder="Digite sua resposta aqui..."
                            rows="3"
                        />
                        <button onClick={() => handleAddResposta(tarefa.id)}>Enviar Resposta</button>
                    </div>
                ))
            )}

            {feedback && <p className="feedback">{feedback}</p>}
        </div>
    );
};

export default TarefasAluno;
