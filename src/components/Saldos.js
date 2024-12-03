// src/components/Saldo.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import './Saldo.css';  // Certifique-se de importar o CSS

const Saldo = () => {
    const { userEmail } = useContext(AuthContext); // Obter o email do usuário logado
    const [coins, setCoins] = useState(null);

    useEffect(() => {
        if (userEmail) {
            // Referência ao nó do usuário no banco de dados
            const usuarioRef = ref(database, 'usuarios');
            onValue(usuarioRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    if (data.email === userEmail) {
                        setCoins(data.coins || 0); // Define o saldo de coins
                    }
                });
            });
        }
    }, [userEmail]);

    // Função para determinar a classe CSS com base no saldo de moedas
    const getCoinClass = () => {
        if (coins < 100) {
            return 'low-balance';  // Menos de 100 moedas (vermelho)
        } else if (coins >= 100 && coins <= 10000) {
            return 'medium-balance';  // Entre 100 e 1000 moedas (verde)
        } else {
            return 'high-balance';  // Mais de 1000 moedas (efeito RGB)
        }
    };

    return (
        <div>
            <h2>Saldo de Coins</h2>
            {coins !== null ? (
                <p>Você possui <strong><span className={getCoinClass()}>{coins}</span></strong> coins em sua conta.</p>
            ) : (
                <p>Carregando saldo...</p>
            )}
        </div>
    );
};

export default Saldo;
