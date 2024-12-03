import React, { useState, useEffect, useContext } from 'react';
import { database } from '../firebase';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { AuthContext } from '../context/AuthContext';
import { FaPlus, FaMinus, FaEdit, FaTrash } from 'react-icons/fa'; // Ícones para ações
import './TarefasProfessor.css';

const TarefasProfessor = () => {
    const { userType } = useContext(AuthContext);
    const [nomeTarefa, setNomeTarefa] = useState('');
    const [descricao, setDescricao] = useState('');
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    const [tarefas, setTarefas] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [expandedTurmas, setExpandedTurmas] = useState({});
    const [editandoTarefa, setEditandoTarefa] = useState(null);

    // Carregar turmas disponíveis
    useEffect(() => {
        const turmasRef = ref(database, 'turmas');
        onValue(turmasRef, (snapshot) => {
            const turmasData = [];
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                turmasData.push(data.nome);
            });
            setTurmas(turmasData);
        });
    }, []);

    // Carregar tarefas criadas
    useEffect(() => {
        const tarefasRef = ref(database, 'tarefas');
        onValue(tarefasRef, (snapshot) => {
            const tarefasData = [];
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                tarefasData.push({ id: childSnapshot.key, ...data });
            });
            setTarefas(tarefasData);
        });
    }, []);

    const handleCreateOrUpdateTask = async (e) => {
        e.preventDefault();

        if (!nomeTarefa || !descricao || !turmaSelecionada) {
            setFeedback('Por favor, preencha todos os campos.');
            return;
        }

        try {
            if (editandoTarefa) {
                const tarefaRef = ref(database, `tarefas/${editandoTarefa}`);
                await update(tarefaRef, {
                    nomeTarefa,
                    descricao,
                    turma: turmaSelecionada,
                });
                setFeedback('Tarefa atualizada com sucesso!');
            } else {
                const novaTarefa = {
                    nomeTarefa,
                    descricao,
                    turma: turmaSelecionada,
                    estado: 'pendente',
                };

                const tarefasRef = ref(database, 'tarefas');
                await push(tarefasRef, novaTarefa);
                setFeedback('Tarefa criada com sucesso!');
            }

            setNomeTarefa('');
            setDescricao('');
            setTurmaSelecionada('');
            setEditandoTarefa(null);
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error);
            setFeedback('Erro ao salvar a tarefa. Tente novamente.');
        }
    };

    const handleEditTask = (tarefa) => {
        setNomeTarefa(tarefa.nomeTarefa);
        setDescricao(tarefa.descricao);
        setTurmaSelecionada(tarefa.turma);
        setEditandoTarefa(tarefa.id);
    };

    const handleDeleteTask = async (id) => {
        try {
            const tarefaRef = ref(database, `tarefas/${id}`);
            await remove(tarefaRef);
            setFeedback('Tarefa excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            setFeedback('Erro ao excluir a tarefa. Tente novamente.');
        }
    };

    const toggleExpandTurma = (turma) => {
        setExpandedTurmas((prev) => ({
            ...prev,
            [turma]: !prev[turma],
        }));
    };

    const tarefasPorTurma = tarefas.reduce((acc, tarefa) => {
        const { turma } = tarefa;
        if (!acc[turma]) {
            acc[turma] = [];
        }
        acc[turma].push(tarefa);
        return acc;
    }, {});

    if (userType !== 'professor') return null;

    return (
        <div className="tarefas-professor-container">
            <h2>{editandoTarefa ? 'Editar Tarefa' : 'Criar Tarefa'}</h2>
            <form onSubmit={handleCreateOrUpdateTask} className="form-tarefa">
                <label>
                    Nome da Tarefa:
                    <input
                        type="text"
                        value={nomeTarefa}
                        onChange={(e) => setNomeTarefa(e.target.value)}
                    />
                </label>
                <label>
                    Descrição:
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                </label>
                <label>
                    Selecionar Turma:
                    <select
                        value={turmaSelecionada}
                        onChange={(e) => setTurmaSelecionada(e.target.value)}
                    >
                        <option value="">Escolha uma turma</option>
                        {turmas.map((turma, index) => (
                            <option key={index} value={turma}>
                                {turma}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">{editandoTarefa ? 'Atualizar Tarefa' : 'Criar Tarefa'}</button>
                {editandoTarefa && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditandoTarefa(null);
                            setNomeTarefa('');
                            setDescricao('');
                            setTurmaSelecionada('');
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </form>
            {feedback && <p className="feedback">{feedback}</p>}

            <h2>Tarefas por Turma</h2>
            {Object.keys(tarefasPorTurma).length === 0 ? (
                <p>Não há tarefas criadas.</p>
            ) : (
                Object.keys(tarefasPorTurma).map((turma) => (
                    <div key={turma} className="tarefas-turma">
                        <h3>
                            <button onClick={() => toggleExpandTurma(turma)}>
                                {expandedTurmas[turma] ? <FaMinus /> : <FaPlus />}
                            </button>
                            Turma: {turma}
                        </h3>
                        {expandedTurmas[turma] && (
                            <div className="tarefas-lista">
                                {tarefasPorTurma[turma].map((tarefa) => (
                                    <div key={tarefa.id} className="tarefa-item">
                                        <h4>{tarefa.nomeTarefa}</h4>
                                        <p><strong>Descrição:</strong> {tarefa.descricao}</p>
                                        <p><strong>Criada por:</strong> {tarefa.criadaPor}</p>
                                        <h5>Respostas dos Alunos:</h5>
                                        {tarefa.respostas ? (
                                            Object.entries(tarefa.respostas).map(([alunoId, resposta]) => (
                                                <p key={alunoId}>
                                                    <strong>{alunoId.replace(/_/g, '.')}:</strong> {resposta.resposta}
                                                </p>
                                            ))
                                        ) : (
                                            <p>Sem respostas enviadas.</p>
                                        )}
                                        <button onClick={() => handleEditTask(tarefa)}>
                                            <FaEdit /> Editar
                                        </button>
                                        <button onClick={() => handleDeleteTask(tarefa.id)}>
                                            <FaTrash /> Excluir
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default TarefasProfessor;
