import { GLSLHills } from './GLSLHills';
import './Hero.css';

const Hero = () => {
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="hero" id="hero">
            <div className="hero__bg">
                <GLSLHills speed={0.3} cameraZ={130} />
            </div>

            <div className="hero__overlay" />

            <div className="hero__content">
                <h1 className="hero__title animate-fade-in-up">
                    Transformamos dados<br />
                    em <span className="text-gradient">resultados reais</span>
                </h1>

                <p className="hero__subtitle animate-fade-in-up delay-200">
                    Desenvolvemos soluções inteligentes que automatizam processos,
                    <br className="hero__br-desktop" />
                    otimizam decisões e aceleram o crescimento do seu negócio.
                </p>

                <div className="hero__actions animate-fade-in-up delay-400">
                    <button className="hero__btn hero__btn--primary" onClick={() => scrollToSection('contato')}>
                        Iniciar Projeto
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button className="hero__btn hero__btn--secondary" onClick={() => scrollToSection('solucoes')}>
                        Ver Soluções
                    </button>
                </div>
            </div>

            <div className="hero__scroll-indicator animate-fade-in delay-800">
                <div className="hero__scroll-line" />
            </div>
        </section>
    );
};

export default Hero;
