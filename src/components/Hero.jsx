import { useEffect, useState } from 'react';
import { GLSLHills } from './GLSLHills';
import './Hero.css';

const heroPhrases = [
    'mais resultado',
    'mais escala',
    'mais eficiência',
];

const TYPING_SPEED = 70;
const DELETING_SPEED = 40;
const HOLD_DURATION = 1600;

const Hero = () => {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentPhrase = heroPhrases[phraseIndex];
        const isComplete = displayedText === currentPhrase;
        const isEmpty = displayedText === '';

        const timeout = setTimeout(() => {
            if (!isDeleting && !isComplete) {
                setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
                return;
            }

            if (!isDeleting && isComplete) {
                setIsDeleting(true);
                return;
            }

            if (isDeleting && !isEmpty) {
                setDisplayedText(currentPhrase.slice(0, displayedText.length - 1));
                return;
            }

            setIsDeleting(false);
            setPhraseIndex((currentIndex) => (currentIndex + 1) % heroPhrases.length);
        }, !isDeleting && isComplete ? HOLD_DURATION : isDeleting ? DELETING_SPEED : TYPING_SPEED);

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, phraseIndex]);

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
                    IA sob medida para
                    <br />
                    <span className="text-gradient hero__title-typed">
                        {displayedText}
                        <span className="hero__caret" aria-hidden="true" />
                    </span>
                </h1>

                <p className="hero__subtitle animate-fade-in-up delay-200">
                    Soluções de inteligência artificial personalizadas
                    <br className="hero__br-desktop" />
                    para escalar operações e aumentar eficiência.
                </p>

                <div className="hero__actions animate-fade-in-up delay-400">
                    <button className="hero__btn hero__btn--primary" onClick={() => scrollToSection('contato')}>
                        Converse conosco
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button className="hero__btn hero__btn--secondary" onClick={() => scrollToSection('solucoes')}>
                        Explorar soluções
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
