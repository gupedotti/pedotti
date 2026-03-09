import { useInView } from '../hooks/useInView';
import Globe from './Globe';
import './Contact.css';

const Contact = () => {
    const [ref, isInView] = useInView();

    return (
        <section className="contact section" id="contato" ref={ref}>
            <div className="container">
                <div className={`contact__wrapper ${isInView ? 'in-view' : ''}`}>
                    <div className="contact__content">
                        <span className="contact__label">Próximo passo</span>
                        <h2 className="contact__title">
                            Se existe um gargalo crítico, existe uma solução em <span className="text-gradient">IA</span> para ele
                        </h2>
                        <p className="contact__description">
                            Fale com a Pedotti para avaliar o seu cenário, identificar oportunidades de maior retorno
                            e estruturar uma solução personalizada para o seu negócio.
                        </p>

                        <div className="contact__info">
                            <a href="https://wa.me/5511988747672" target="_blank" rel="noopener noreferrer" className="contact__info-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                WhatsApp
                            </a>
                        </div>

                        <a
                            href="https://wa.me/5511988747672?text=Olá! Gostaria de entender como a Pedotti pode desenhar uma solução de IA para o meu negócio."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact__cta"
                        >
                            Converse conosco
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>

                    <div className="contact__visual">
                        <Globe />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
