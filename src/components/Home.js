// src/pages/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Para estilização

import Logo from "./img/logotipo2.png";

const Home = () => {
    return (
        <div className="homepage">
            <img src={Logo} alt="Logomarca" className="Logo" /> {/* Imagem da logomarca */}
            <h1>Bem-vindo ao COINS, sua carteira digital!</h1>
            <p>Para instigar e motivar os estudantes a se aprimorarem cada vez mais.</p>
            <div className="button-container">
                <Link to="/sobre" className="home-button">Saiba Mais</Link> {/* Novo botão Saiba Mais */}
            </div>
        </div>
    );
};

export default Home;
