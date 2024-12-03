import React, { useState } from 'react';
import './PremiosProfessor.css';

const PremiosProfessor = () => {
    // Dados mockados iniciais
    const [premios, setPremios] = useState([
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
            descricao: 'Mouse com alta precisão e iluminação RGB.',
            custo: 300,
            imagem: 'https://via.placeholder.com/150?text=Mouse+Gamer',
        },
        {
            id: 4,
            nome: 'Teclado Mecânico',
            descricao: 'Teclado com switches mecânicos e iluminação RGB.',
            custo: 700,
            imagem: 'https://via.placeholder.com/150?text=Teclado+Mecânico',
        },
    ]);

    const [nomePremio, setNomePremio] = useState('');
    const [descricao, setDescricao] = useState('');
    const [custo, setCusto] = useState('');
    const [imagem, setImagem] = useState(null);
    const [feedback, setFeedback] = useState('');

    // Função para adicionar prêmios à lista mockada
    const handleCreatePremio = (e) => {
        e.preventDefault();

        if (!nomePremio || !descricao || !custo || !imagem) {
            setFeedback('Por favor, preencha todos os campos.');
            return;
        }

        const novoPremio = {
            id: premios.length + 1,
            nome: nomePremio,
            descricao,
            custo: parseInt(custo),
            imagem: URL.createObjectURL(imagem), // Carrega a imagem para exibição local
        };

        setPremios([...premios, novoPremio]);
        setNomePremio('');
        setDescricao('');
        setCusto('');
        setImagem(null);
        setFeedback('Prêmio cadastrado com sucesso!');
    };

    return (
        <div className="premios-professor-container">
            <h2>Cadastrar Prêmios</h2>
            <form onSubmit={handleCreatePremio} className="form-premios">
                <label>
                    Nome do Prêmio:
                    <input
                        type="text"
                        value={nomePremio}
                        onChange={(e) => setNomePremio(e.target.value)}
                        placeholder="Digite o nome do prêmio"
                    />
                </label>
                <label>
                    Descrição:
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Digite a descrição do prêmio"
                    />
                </label>
                <label>
                    Custo em Coins:
                    <input
                        type="number"
                        value={custo}
                        onChange={(e) => setCusto(e.target.value)}
                        placeholder="Digite o custo em coins"
                    />
                </label>
                <label>
                    Imagem do Prêmio:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagem(e.target.files[0])}
                    />
                </label>
                <button type="submit">Cadastrar Prêmio</button>
            </form>
            {feedback && <p className="feedback">{feedback}</p>}

            <h2>Prêmios Cadastrados</h2>
            {premios.length === 0 ? (
                <p>Não há prêmios cadastrados.</p>
            ) : (
                <div className="premios-lista">
                    {premios.map((premio) => (
                        <div key={premio.id} className="premio-item">
                            <img src={premio.imagem} alt={premio.nome} />
                            <h3>{premio.nome}</h3>
                            <p>{premio.descricao}</p>
                            <p><strong>Custo:</strong> {premio.custo} Coins</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PremiosProfessor;
