import { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoLoaded, setLogoLoaded] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        const timer = setTimeout(() => setLogoLoaded(true), 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        const previousTouchAction = document.body.style.touchAction;

        if (menuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = previousOverflow;
            document.body.style.touchAction = previousTouchAction;
        }

        return () => {
            document.body.style.overflow = previousOverflow;
            document.body.style.touchAction = previousTouchAction;
        };
    }, [menuOpen]);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setMenuOpen(false);
        }
    };

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar__inner">
                <a href="#" className="navbar__logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false); }}>
                    <img
                        src="/logo-pedotti.png"
                        alt="Pedotti"
                        className={`navbar__logo-img ${logoLoaded ? 'navbar__logo-img--loaded' : ''}`}
                    />
                </a>

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
                    onClick={() => setMenuOpen((current) => !current)}
                    aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
