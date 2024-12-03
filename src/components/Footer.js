import React, { useEffect, useState } from 'react';
import './Footer.css'; // Importe o arquivo CSS para o footer

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        // Pega a altura total da página (incluindo o conteúdo fora da tela)
        const scrollHeight = document.documentElement.scrollHeight;
        // Posição atual da rolagem
        const scrollPosition = window.innerHeight + window.scrollY;

        // Verifica se o usuário chegou no final da página
        if (scrollHeight - scrollPosition <= 1) {
            setIsVisible(true); // Exibe o footer quando o usuário chega no final da página
        } else {
            setIsVisible(false); // Esconde o footer quando o usuário não está no final
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll); // Adiciona o evento de rolagem

        // Limpa o evento de scroll quando o componente é desmontado
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <footer className={`footer ${isVisible ? 'visible' : ''}`}>
            <p>&copy; {new Date().getFullYear()} Banco Digital para Alunos e Professores. Todos os direitos reservados.</p>
        </footer>
    );
};

export default Footer;
