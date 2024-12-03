// src/components/Tabela.js

import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import './Tabela.css';

const Tabela = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [turmas, setTurmas] = useState({});

    useEffect(() => {
        const usuariosRef = ref(database, 'usuarios');

        // Lê os dados dos usuários do Firebase
        onValue(usuariosRef, (snapshot) => {
            const usuariosData = [];
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const id = childSnapshot.key;
                usuariosData.push({ id, ...data });
            });

            // Ordena os usuários pelo número de coins em ordem decrescente
            usuariosData.sort((a, b) => b.coins - a.coins);
            setUsuarios(usuariosData);
        });

        // Lê os dados das turmas do Firebase
        const turmasRef = ref(database, 'turmas');
        onValue(turmasRef, (snapshot) => {
            const turmasData = {};
            snapshot.forEach((childSnapshot) => {
                const turmaId = childSnapshot.key;
                const turmaInfo = childSnapshot.val();
                turmasData[turmaId] = turmaInfo.nome;
            });
            setTurmas(turmasData);
        });
    }, []);

    return (
        <div>
            <h2>Tabela de Alunos Cadastrados</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Turma</th>
                        <th>Coins</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.nome}</td>
                            <td>{usuario.email}</td>
                            {/* Exibe o nome da turma usando o ID armazenado */}
                            <td>{turmas[usuario.turma] || 'Nenhuma'}</td>
                            <td>{usuario.coins}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tabela;
