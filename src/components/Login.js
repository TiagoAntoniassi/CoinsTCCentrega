import React, { useState, useEffect, useContext } from 'react';
import { database } from '../firebase';
import { ref, get, child } from 'firebase/database';
import { AuthContext } from '../context/AuthContext'; // Importa o contexto
import './Login.css';

const Login = () => {
    const { setUserEmail, setUserType, isLoggedIn, logout } = useContext(AuthContext); // Obtém as funções do contexto
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [userType, setUserTypeState] = useState('usuario');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { email, userType } = JSON.parse(storedUser);
            setEmail(email);
            setUserTypeState(userType);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !senha) {
            setFeedback("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const userRef = userType === 'usuario' ? 'usuarios' : 'professores';
            const snapshot = await get(child(ref(database), userRef));

            if (snapshot.exists()) {
                const users = snapshot.val();
                const user = Object.values(users).find(u => u.email === email && u.senha === senha);

                if (user) {
                    setFeedback("Login bem-sucedido!");

                    // Armazena informações do usuário no localStorage e no contexto
                    localStorage.setItem('user', JSON.stringify({ email, userType }));
                    setUserEmail(email); // Atualiza o e-mail no contexto
                    setUserType(userType); // Atualiza o tipo de usuário no contexto

                    // Recarrega a página para aplicar as novas funções
                    window.location.reload();
                } else {
                    setFeedback("E-mail ou senha incorretos.");
                }
            } else {
                setFeedback("Nenhum usuário encontrado.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setFeedback("Erro ao fazer login. Tente novamente.");
        }
    };

    const handleLogout = () => {
        logout(); // Chama a função de logout do contexto
        setFeedback("Você foi desconectado.");
        setEmail('');
        setSenha('');

        // Recarrega a página ao deslogar
        window.location.reload();
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                {!isLoggedIn ? (
                    <form className="login-form" onSubmit={handleLogin}>
                        <label>
                            Tipo de usuário:
                            <select
                                value={userType}
                                onChange={(e) => setUserTypeState(e.target.value)}
                                className="login-select"
                            >
                                <option value="usuario">Usuário</option>
                                <option value="professor">Professor</option>
                            </select>
                        </label>

                        <label>
                            E-mail:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                            />
                        </label>

                        <label>
                            Senha:
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="login-input"
                            />
                        </label>

                        <button type="submit" className="login-button">Entrar</button>
                    </form>
                ) : (
                    <div className="welcome-box">
                        <h3>Bem-vindo, {userType === 'usuario' ? 'Usuário' : 'Professor'}!</h3>
                        <p>Você está logado com sucesso.</p>
                        <button onClick={handleLogout} className="logout-button">Sair</button>
                    </div>
                )}
                {feedback && (
                    <p className={`feedback ${feedback.includes("sucesso") ? "success" : "error"}`}>
                        {feedback}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
