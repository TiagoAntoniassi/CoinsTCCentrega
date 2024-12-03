import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './PremiosProfessor.css';

const PremiosAluno = () => {
    const { userType, userCoins } = useContext(AuthContext); // Pega o saldo do aluno
    const [premios, setPremios] = useState([]);
    const [feedback, setFeedback] = useState('');

    // Dados mockados dos prêmios
    useEffect(() => {
        const premiosMockados = [
            {
                id: 1,
                nome: 'iPhone 14 Pro',
                descricao: 'Último modelo da Apple com câmera avançada.',
                custo: 1000,
                imagem: 'https://via.placeholder.com/150?text=iPhone+14+Pro',
            },
            {
                id: 2,
                nome: 'Headset Gamer',
                descricao: 'Headset com som surround para imersão total.',
                custo: 500,
                imagem: 'https://via.placeholder.com/150?text=Headset+Gamer',
            },
            {
                id: 3,
                nome: 'Mouse Gamer',
                descricao: 'Mouse com DPI ajustável e design ergonômico.',
                custo: 200,
                imagem: 'https://via.placeholder.com/150?text=Mouse+Gamer',
            },
            {
                id: 4,
                nome: 'Teclado Mecânico',
                descricao: 'Teclado mecânico com iluminação RGB personalizável.',
                custo: 300,
                imagem: 'https://via.placeholder.com/150?text=Teclado+Mecanico',
            },
        ];
        setPremios(premiosMockados);
    }, []);

    // Certifique-se de que o tipo de usuário seja "usuario"
    if (userType !== 'usuario') {
        return <p>Acesso negado. Esta página é exclusiva para alunos.</p>;
    }

    return (
        <div className="premios-aluno-container">
            <h2>Resgatar Prêmios</h2>
            <p>Saldo atual: <strong>{userCoins} Coins</strong></p>

            {premios.length === 0 ? (
                <p>Não há prêmios disponíveis no momento.</p>
            ) : (
                <ul className="premios-lista">
                    {premios.map((premio) => (
                        <li key={premio.id} className="premio-item">
                            <img src={premio.imagem} alt={premio.nome} />
                            <h3>{premio.nome}</h3>
                            <p>{premio.descricao}</p>
                            <p><strong>Custo:</strong> {premio.custo} Coins</p>
                            {/* Botão apenas visual */}
                            <button disabled>Resgatar</button>
                        </li>
                    ))}
                </ul>
            )}

            {feedback && <p className="feedback">{feedback}</p>}
        </div>
    );
};

export default PremiosAluno;
