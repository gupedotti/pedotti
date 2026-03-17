import { useInView } from '../hooks/useInView';
import Globe from './Globe';
import './Contact.css';

const Contact = () => {
    const [ref, isInView] = useInView();

    return (
        <section className="contact section" id="contato" ref={ref} aria-labelledby="contact-title">
            <div className="container">
                <div className={`contact__wrapper ${isInView ? 'in-view' : ''}`}>
                    <div className="contact__content">
                        <span className="contact__label">Próximo passo</span>
                        <h2 className="contact__title" id="contact-title">
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
                            <a href="mailto:pedotti@agentmail.to" className="contact__info-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                pedotti@agentmail.to
                            </a>
                        </div>

                        <button
                            className="contact__cta"
                            onClick={() => window.dispatchEvent(new Event('open-chat'))}
                        >
                            Converse conosco
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="contact__visual" aria-hidden="true">
                        <Globe />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
