import { useInView } from '../hooks/useInView';
import './Solutions.css';

const solutions = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        title: 'Chatbots Inteligentes',
        description: 'Assistentes virtuais com IA conversacional que entendem contexto, aprendem com interações e resolvem problemas reais dos seus clientes.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
            </svg>
        ),
        title: 'Análise Preditiva',
        description: 'Modelos de machine learning que antecipam tendências, identificam padrões ocultos e transformam dados brutos em decisões estratégicas.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
            </svg>
        ),
        title: 'Automação de Processos',
        description: 'Workflows inteligentes que eliminam tarefas repetitivas, reduzem erros e liberam sua equipe para o que realmente importa.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 6v6" /><path d="M1 12h6m6 0h6" /><path d="M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24" /><path d="M19.78 4.22l-4.24 4.24m-3.08 3.08l-4.24 4.24" />
            </svg>
        ),
        title: 'Visão Computacional',
        description: 'Sistemas de reconhecimento visual para controle de qualidade, segurança e análise de imagens em tempo real com precisão superior.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        ),
        title: 'Integrações Customizadas',
        description: 'Conectamos IA aos seus sistemas existentes — ERPs, CRMs, plataformas de e-commerce — sem interromper suas operações.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
        ),
        title: 'Consultoria em IA',
        description: 'Diagnóstico completo do seu negócio, identificação de oportunidades e roadmap estratégico para implementação de inteligência artificial.',
    },
];

const Solutions = () => {
    const [ref, isInView] = useInView();

    return (
        <section className="solutions section" id="solucoes" ref={ref}>
            <div className="container">
                <div className={`solutions__header ${isInView ? 'in-view' : ''}`}>
                    <span className="solutions__label">Soluções</span>
                    <h2 className="solutions__title">
                        Tecnologia que <span className="text-gradient">resolve</span>
                    </h2>
                    <p className="solutions__subtitle">
                        Cada solução é desenvolvida sob medida para o seu desafio específico.
                    </p>
                </div>

                <div className={`solutions__grid ${isInView ? 'in-view' : ''}`}>
                    {solutions.map((solution, i) => (
                        <div
                            key={i}
                            className="solutions__card"
                            style={{ transitionDelay: `${200 + i * 80}ms` }}
                        >
                            <div className="solutions__card-icon">{solution.icon}</div>
                            <h3 className="solutions__card-title">{solution.title}</h3>
                            <p className="solutions__card-description">{solution.description}</p>
                            <div className="solutions__card-arrow">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Solutions;
