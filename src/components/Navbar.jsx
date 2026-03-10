import { useEffect, useState, useCallback } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoLoaded, setLogoLoaded] = useState(false);
    const [scrollDirection, setScrollDirection] = useState('up');

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 50);

            // Determina se subiu ou desceu o scroll
            if (currentScrollY > 100) {
                if (currentScrollY > lastScrollY) {
                    setScrollDirection('down');
                } else {
                    setScrollDirection('up');
                }
            } else {
                setScrollDirection('up'); // Sempre force o menu pra baixo no topo da página
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        const timer = setTimeout(() => setLogoLoaded(true), 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (!menuOpen) return;

        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
        };
    }, [menuOpen]);

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    const scrollToSection = useCallback((id) => {
        setMenuOpen(false);
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    }, []);

    // Se estiver descendo (down), aplica a classe que sobe o menu da tela no mobile
    return (
        <nav
            className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${scrollDirection === 'down' ? 'navbar--hidden-mobile' : ''}`}
            aria-label="Navegação principal"
        >
            <div className="navbar__inner">
                <a
                    href="#"
                    className="navbar__logo"
                    onClick={(e) => {
                        e.preventDefault();
                        setMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <img
                        src="/logo-pedotti.png"
                        alt="Pedotti — Início"
                        className={`navbar__logo-img ${logoLoaded ? 'navbar__logo-img--loaded' : ''}`}
                        width="120"
                        height="32"
                    />
                </a>

                <div
                    className={`navbar__overlay ${menuOpen ? 'navbar__overlay--open' : ''}`}
                    onClick={closeMenu}
                    aria-hidden="true"
                />

                <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
                    <button className="navbar__link" onClick={() => scrollToSection('sobre')}>Sobre</button>
                    <button className="navbar__link" onClick={() => scrollToSection('solucoes')}>Soluções</button>
                    <button className="navbar__link" onClick={() => scrollToSection('processo')}>Processo</button>
                    <button className="navbar__link" onClick={() => scrollToSection('contato')}>Contato</button>
                </div>

                <button className="navbar__cta" onClick={() => scrollToSection('contato')}>
                    Agendar diagnóstico
                </button>

                <button
                    className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                    aria-expanded={menuOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
