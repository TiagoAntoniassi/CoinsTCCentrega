import React, { useState, useEffect, useContext } from 'react';
import { database } from '../firebase';
import { ref, onValue, update, push } from 'firebase/database';
import { AuthContext } from '../context/AuthContext';

const Depositos = () => {
    const { userEmail } = useContext(AuthContext); // Pega o email do professor logado
    const [alunos, setAlunos] = useState([]);
    const [turmas, setTurmas] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [coins, setCoins] = useState({}); // Agora é um objeto para armazenar os coins de cada aluno
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        // Carregar todos os alunos do banco de dados
        const usuariosRef = ref(database, 'usuarios');
        onValue(usuariosRef, (snapshot) => {
            const alunosData = [];
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const id = childSnapshot.key;
                alunosData.push({ id, ...data });
            });
            setAlunos(alunosData);
        });

        // Carregar os nomes das turmas
        const turmasRef = ref(database, 'turmas');
        onValue(turmasRef, (snapshot) => {
            const turmasData = {};
            snapshot.forEach((childSnapshot) => {
                const id = childSnapshot.key;
                const data = childSnapshot.val();
                turmasData[id] = data.nome; // Relaciona o ID da turma ao nome
            });
            setTurmas(turmasData);
        });
    }, []);

    // Filtrar alunos pelo termo de busca
    const alunosFiltrados = alunos.filter((aluno) =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Função para atualizar coins no banco de dados
    const handleAddCoins = async (alunoId) => {
        try {
            const alunoRef = ref(database, `usuarios/${alunoId}`);
            const aluno = alunos.find((aluno) => aluno.id === alunoId);
            const novoSaldo = (aluno.coins || 0) + parseInt(coins[alunoId] || 0, 10); // Agora usa o valor individual por aluno

            // Atualiza os coins do aluno
            await update(alunoRef, { coins: novoSaldo });

            // Cria a transação de depósito, incluindo o email do professor
            const transacaoRef = ref(database, 'transacoes');
            await push(transacaoRef, {
                alunoId: aluno.email, // Email do aluno
                professorId: userEmail, // Email do professor logado
                quantidade: coins[alunoId] || 0, // Quantidade de coins
                data: new Date().toISOString(), // Data do depósito
                comentario: 'Depósito de Coins', // Comentário (pode ser ajustado)
            });

            setFeedback(`Coins adicionados para ${aluno.nome}`);
            setCoins((prevCoins) => ({ ...prevCoins, [alunoId]: '' })); // Resetar o valor de coins para o aluno após o depósito
        } catch (error) {
            console.error("Erro ao adicionar coins:", error);
            setFeedback("Erro ao adicionar coins. Tente novamente.");
        }
    };

    return (
        <div>
            <h2>Depósitos de Coins</h2>
            <input
                type="text"
                placeholder="Buscar aluno pelo nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div style={{ marginTop: '20px' }}>
                {alunosFiltrados.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Turma</th>
                                <th>Coins</th>
                                <th>Adicionar Coins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunosFiltrados.map((aluno) => (
                                <tr key={aluno.id}>
                                    <td>{aluno.nome}</td>
                                    <td>{turmas[aluno.turma] || 'Turma não encontrada'}</td>
                                    <td>{aluno.coins || 0}</td>
                                    <td>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={coins[aluno.id] || ''} // Agora o valor inicial é vazio
                                            onChange={(e) => setCoins((prevCoins) => ({
                                                ...prevCoins,
                                                [aluno.id]: e.target.value, // Atualiza o valor de coins para o aluno
                                            }))}
                                            style={{ width: '60px' }}
                                        />
                                        <button onClick={() => handleAddCoins(aluno.id)}>
                                            Adicionar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhum aluno encontrado.</p>
                )}
            </div>
            {feedback && <p style={{ color: 'green' }}>{feedback}</p>}
        </div>
    );
};

export default Depositos;
