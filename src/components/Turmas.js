// src/components/Turmas.js

import React, { useState, useEffect, useContext } from 'react';
import { database } from '../firebase';
import { ref, push, update, remove, onValue } from 'firebase/database';
import { AuthContext } from '../context/AuthContext';
import './Turmas.css';

const Turmas = () => {
    const { userType } = useContext(AuthContext);
    const [turmas, setTurmas] = useState([]);
    const [filteredTurmas, setFilteredTurmas] = useState([]);
    const [newTurmaName, setNewTurmaName] = useState('');
    const [expandedTurmaId, setExpandedTurmaId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [alunosCadastrados, setAlunosCadastrados] = useState([]);
    const [alunoSearchTerm, setAlunoSearchTerm] = useState('');

    useEffect(() => {
        if (userType === 'professor') {
            // Observa as turmas no Firebase
            const turmasRef = ref(database, 'turmas');
            onValue(turmasRef, (snapshot) => {
                const turmasData = snapshot.val();
                const turmaList = turmasData
                    ? Object.entries(turmasData).map(([id, turma]) => ({ id, ...turma }))
                    : [];
                setTurmas(turmaList);
                setFilteredTurmas(turmaList);
            });

            // Observa os usuários no Firebase
            const alunosRef = ref(database, 'usuarios');
            onValue(alunosRef, (snapshot) => {
                const alunosData = snapshot.val();
                const alunoList = alunosData
                    ? Object.entries(alunosData).map(([id, aluno]) => ({ id, ...aluno }))
                    : [];
                setAlunosCadastrados(alunoList);
            });
        }
    }, [userType]);

    const handleCreateTurma = async () => {
        if (newTurmaName.trim()) {
            const turmaRef = ref(database, 'turmas');
            await push(turmaRef, { nome: newTurmaName, alunos: {} });
            setNewTurmaName('');
        }
    };

    const handleAddAluno = async (turmaId, aluno) => {
        if (aluno) {
            const turmaAlunosRef = ref(database, `turmas/${turmaId}/alunos/${aluno.id}`);
            const alunoRef = ref(database, `usuarios/${aluno.id}`);

            // Adiciona o aluno à turma e atualiza seu cadastro
            await Promise.all([
                update(turmaAlunosRef, { nome: aluno.nome, email: aluno.email }),
                update(alunoRef, { turma: turmaId }),
            ]);
        }
    };

    const handleRemoveAluno = async (turmaId, alunoId) => {
        const alunoTurmaRef = ref(database, `turmas/${turmaId}/alunos/${alunoId}`);
        const alunoRef = ref(database, `usuarios/${alunoId}`);
        await Promise.all([
            remove(alunoTurmaRef),
            update(alunoRef, { turma: null }),
        ]);
    };

    const toggleExpandTurma = (turmaId) => {
        setExpandedTurmaId(expandedTurmaId === turmaId ? null : turmaId);
    };

    useEffect(() => {
        const searchTermLower = searchTerm.toLowerCase();
        setFilteredTurmas(
            turmas.filter((turma) => turma.nome.toLowerCase().includes(searchTermLower))
        );
    }, [searchTerm, turmas]);

    const filteredAlunosCadastrados = alunosCadastrados.filter((aluno) =>
        aluno.nome.toLowerCase().includes(alunoSearchTerm.toLowerCase())
    );

    return (
        <div className="turmas">
            <h2>Gerenciar Turmas</h2>

            <input
                type="text"
                placeholder="Pesquisar turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />

            <div className="turma-form">
                <input
                    type="text"
                    placeholder="Nome da nova turma"
                    value={newTurmaName}
                    onChange={(e) => setNewTurmaName(e.target.value)}
                />
                <button onClick={handleCreateTurma}>Criar Turma</button>
            </div>

            <div className="turma-list">
                {filteredTurmas.map((turma) => (
                    <div key={turma.id} className="turma-item">
                        <h3 onClick={() => toggleExpandTurma(turma.id)} className="turma-name">
                            {turma.nome}
                            <span>{expandedTurmaId === turma.id ? '▲' : '▼'}</span>
                        </h3>

                        {expandedTurmaId === turma.id && (
                            <div className="turma-details">
                                <ul>
                                    {turma.alunos ? (
                                        Object.entries(turma.alunos).map(([alunoId, aluno]) => (
                                            <li key={alunoId}>
                                                {aluno.nome} ({aluno.email})
                                                <button onClick={() => handleRemoveAluno(turma.id, alunoId)}>Remover</button>
                                            </li>
                                        ))
                                    ) : (
                                        <p>Sem alunos nesta turma.</p>
                                    )}
                                </ul>

                                <input
                                    type="text"
                                    placeholder="Pesquisar aluno..."
                                    value={alunoSearchTerm}
                                    onChange={(e) => setAlunoSearchTerm(e.target.value)}
                                    className="search-bar"
                                />

                                {alunoSearchTerm && (
                                    <div className="search-results">
                                        {filteredAlunosCadastrados.map((aluno) => (
                                            <div key={aluno.id} className="search-result">
                                                {aluno.nome} ({aluno.email})
                                                <button onClick={() => handleAddAluno(turma.id, aluno)} style={{ marginLeft: '10px' }}>
                                                    Adicionar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Turmas;
