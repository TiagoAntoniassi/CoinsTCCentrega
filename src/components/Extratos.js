import React, { useState, useEffect, useContext } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { AuthContext } from '../context/AuthContext';

const Extratos = () => {
    const { userEmail, userType } = useContext(AuthContext); // Obtém o email do aluno logado
    const [transacoes, setTransacoes] = useState([]);
    const [feedback, setFeedback] = useState('');

    // Carregar as transações feitas para o aluno
    useEffect(() => {
        const transacoesRef = ref(database, 'transacoes');
        
        // Ouvir as mudanças nas transações
        onValue(transacoesRef, (snapshot) => {
            const transacoesData = [];
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                // Verificar se o email do aluno corresponde ao aluno da transação
                if (data.alunoId === userEmail) {
                    transacoesData.push({ id: childSnapshot.key, ...data });
                }
            });
            
            // Se não houver transações, exibe uma mensagem
            if (transacoesData.length === 0) {
                setFeedback('Nenhuma transação encontrada.');
            }
            
            // Atualiza o estado com as transações
            setTransacoes(transacoesData);
        });
    }, [userEmail]);

    return (
        <div>
            <h2>Extratos de Transações</h2>
            
            {/* Feedback caso não haja transações */}
            {feedback && <p>{feedback}</p>}
            
            {/* Se houver transações, exibe na tabela */}
            {transacoes.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Professor</th>
                            <th>Data</th>
                            <th>Saldo</th>
                            <th>Comentário</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacoes.map((transacao) => (
                            <tr key={transacao.id}>
                                {/* Adicionando data-label para tornar a tabela responsiva */}
                                <td data-label="Professor">{transacao.professorId}</td>
                                <td data-label="Data">{new Date(transacao.data).toLocaleString()}</td>
                                <td data-label="Saldo">{transacao.quantidade}</td>
                                <td data-label="Comentário">{transacao.comentario || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Sem transações para mostrar.</p>
            )}
        </div>
    );
};

export default Extratos;
