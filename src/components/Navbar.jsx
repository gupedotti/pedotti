import { useState, useEffect } from 'react';
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

        // Trigger logo animation after a small delay
        const timer = setTimeout(() => setLogoLoaded(true), 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

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
                <a href="#" className="navbar__logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
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
                    Fale Conosco
                </button>

                <button
                    className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menu"
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
