import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para navegação
import { AuthContext } from '../context/AuthContext';
import './Header.css'; // Arquivo CSS para estilização
import Logotipo from "./img/logotipo.png";

const Header = ({ theme }) => {
    const { userEmail, setUserEmail } = useContext(AuthContext);
    const navigate = useNavigate(); // Hook para redirecionar

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUserEmail('');
        window.location.reload();
    };

    const handleLogin = () => {
        navigate('/login'); // Redireciona para a página de login
    };

    return (
        <header className={`header ${theme}`} style={headerStyle}>
            {/* Logo centralizada */}
            <div style={logoContainerStyle}>
                <button onClick={() => navigate('/')} style={logoButtonStyle}>
                    <img 
                        src={Logotipo}
                        alt="Logo"
                        style={logoStyle}
                    />
                </button>
            </div>

            {/* Área de usuário à direita */}
            <div style={userContainerStyle}>
                {userEmail ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>Bem-vindo, {userEmail}</span>
                        <button onClick={handleLogout} style={logoutButtonStyle}>
                            Sair
                        </button>
                    </div>
                ) : (
                    <button onClick={handleLogin} style={loginButtonStyle}>
                        Faça login
                    </button>
                )}
            </div>
        </header>
    );
};

// Estilos inline para o Header
const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#282c34',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
};

// Estilo para o container da logo
const logoContainerStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
    overflow: 'visible',
};

// Estilo da logo
const logoStyle = {
    height: '150px',
};

const logoButtonStyle = {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
};

// Estilo para a área do usuário
const userContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
};

// Estilo do botão de logout
const logoutButtonStyle = {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#ff4d4d',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
};

logoutButtonStyle[':hover'] = {
    backgroundColor: '#b82635',
};

// Estilo do botão de login
const loginButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#54ff29',
    border: 'none',
    color: '#282c34',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
};

loginButtonStyle[':hover'] = {
    backgroundColor: '#4098d7',
};

export default Header;
