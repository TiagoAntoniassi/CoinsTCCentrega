import React from 'react';
import Header from './components/header';
import Menu from './components/Menu';
import Footer from './components/Footer'; // Importa o Footer
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CadastroUsuario from './components/CadastroUsuario';
import CadastroProfessor from './components/CadastroProfessor';
import { AuthProvider } from './context/AuthContext';
import Depositos from './components/Depositos';
import Extratos from './components/Extratos';
import Saldos from './components/Saldos';
import Login from './components/Login';
import Home from './components/Home';
import Tabela from './components/Tabela';
import Sobre from './components/Sobre';
import CriarTarefas from './components/TarefasProfessor';
import Turmas from './components/Turmas';
import TarefasAluno from './components/TarefasAluno'; // Importar TarefasAluno
import PremiosProfessor from './components/PremiosProfessor'; // Importar PremiosProfessor
import PremiosAluno from './components/PremiosAlunos'; // Importar PremiosAluno

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Header /> {/* Header sempre no topo */}
                <Menu /> {/* Menu lateral */}
                <main style={{ marginLeft: '200px', marginTop: '80px', padding: '20px' }}>
                    <Routes>
                        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
                        <Route path="/cadastro-professor" element={<CadastroProfessor />} />
                        <Route path="/depositos" element={<Depositos />} />
                        <Route path="/" element={<Home />} /> {/* Rota para a Home */}
                        <Route path="/extratos" element={<Extratos />} />
                        <Route path="/saldos" element={<Saldos />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/turmas" element={<Turmas />} />
                        <Route path="/criar-tarefa" element={<CriarTarefas />} />
                        <Route path="/tabela" element={<Tabela />} /> {/* Nova rota para a tabela */}
                        <Route path="/sobre" element={<Sobre />} />
                        <Route path="/tarefas-aluno" element={<TarefasAluno />} />
                        <Route path="/premios-professor" element={<PremiosProfessor />} /> {/* Nova rota */}
                        <Route path="/premios-aluno" element={<PremiosAluno />} /> {/* Nova rota */}
                    </Routes>
                </main>
                <Footer /> {/* Footer sempre no final */}
            </Router>
        </AuthProvider>
    );
};

export default App;
