import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    FaUserPlus,
    FaChalkboardTeacher,
    FaMoneyCheckAlt,
    FaTasks,
    FaTable,
    FaSignInAlt,
    FaUsers,
    FaGift
} from 'react-icons/fa'; // Adicionado FaGift para os prêmios
import './Menu.css';

const Menu = () => {
    const { userType, isLoggedIn } = useContext(AuthContext);

    return (
        <div style={{ position: 'relative', display: 'flex' }}>
            <nav className="menu open">
                <ul>
                    {/* Mostrar link de login somente se não estiver logado */}
                    {!isLoggedIn && (
                        <>
                        <li>
                            <Link to="/login">
                                <FaSignInAlt /> Login
                            </Link>
                        </li>
                        <li>
                                <Link to="/cadastro-usuario">
                                    <FaUserPlus /> Cadastro de Usuário
                                </Link>
                            </li>
                            <li>
                                <Link to="/cadastro-professor">
                                    <FaChalkboardTeacher /> Cadastro de Professor
                                </Link>
                            </li>
                        </>
                    )}

                    {/* Links comuns para todos os usuários logados */}
                    {isLoggedIn && (
                        <>
                            <li>
                                <Link to="/tabela">
                                    <FaTable /> Tabela de Alunos
                                </Link>
                            </li>
                            
                        </>
                    )}

                    {/* Opções exclusivas para professores */}
                    {isLoggedIn && userType === 'professor' && (
                        <>
                            <li>
                                <Link to="/cadastro-usuario">
                                    <FaUserPlus /> Cadastro de Usuário
                                </Link>
                            </li>
                            <li>
                                <Link to="/cadastro-professor">
                                    <FaChalkboardTeacher /> Cadastro de Professor
                                </Link>
                            </li>
                            <li>
                                <Link to="/depositos">
                                    <FaMoneyCheckAlt /> Depósitos
                                </Link>
                            </li>
                            <li>
                                <Link to="/criar-tarefa">
                                    <FaTasks /> Criar Tarefa
                                </Link>
                            </li>
                            <li>
                                <Link to="/premios-professor">
                                    <FaGift /> Cadastrar Prêmios
                                </Link>
                            </li>
                            <li>
                                <Link to="/turmas">
                                    <FaUsers /> Gerenciar Turmas
                                </Link>
                            </li>
                        </>
                    )}

                    {/* Opções exclusivas para alunos */}
                    {isLoggedIn && userType === 'usuario' && (
                        <>
                            <li>
                                <Link to="/extratos">
                                    <FaMoneyCheckAlt /> Extratos
                                </Link>
                            </li>
                            <li>
                                <Link to="/saldos">
                                    <FaMoneyCheckAlt /> Saldos
                                </Link>
                            </li>
                            <li>
                                <Link to="/tarefas-aluno">
                                    <FaTasks /> Tarefas
                                </Link>
                            </li>
                            <li>
                                <Link to="/premios-aluno">
                                    <FaGift /> Resgatar Prêmios
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {/* Conteúdo principal */}
            <div className="content menu-open">
                {/* Aqui é onde o conteúdo principal da página será renderizado */}
            </div>
        </div>
    );
};

export default Menu;
