import { useInView } from '../hooks/useInView';
import './Solutions.css';

const solutions = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        title: 'Agentes conversacionais',
        description: 'Agentes treinados para atendimento, vendas, suporte e qualificação, com contexto de negócio e integração aos seus canais.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
            </svg>
        ),
        title: 'Análise preditiva',
        description: 'Modelos que antecipam demanda, risco, churn, inadimplência e comportamento operacional para decisões mais rápidas e mais precisas.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
            </svg>
        ),
        title: 'Automação inteligente',
        description: 'Fluxos que substituem tarefas manuais, padronizam execução e liberam sua equipe para atividades de maior valor.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 6v6" /><path d="M1 12h6m6 0h6" /><path d="M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24" /><path d="M19.78 4.22l-4.24 4.24m-3.08 3.08l-4.24 4.24" />
            </svg>
        ),
        title: 'Visão computacional',
        description: 'Sistemas para inspeção, segurança, leitura visual e análise de imagens em tempo real com aplicação industrial e operacional.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        ),
        title: 'Integrações sob medida',
        description: 'Conectamos IA ao seu ERP, CRM, BI, e-commerce ou stack interno para que a solução funcione dentro do fluxo que sua operação já utiliza.',
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
        ),
        title: 'Consultoria executiva em IA',
        description: 'Mapeamos oportunidades, priorizamos casos de uso e estruturamos um roadmap para implantação segura e economicamente viável.',
    },
];

const Solutions = () => {
    const [ref, isInView] = useInView();

    return (
        <section className="solutions section" id="solucoes" ref={ref} aria-labelledby="solutions-title">
            <div className="container">
                <div className={`solutions__header ${isInView ? 'in-view' : ''}`}>
                    <span className="solutions__label">Soluções</span>
                    <h2 className="solutions__title" id="solutions-title">
                        Soluções desenhadas para o seu <span className="text-gradient">cenário real</span>
                    </h2>
                    <p className="solutions__subtitle">
                        Não trabalhamos com pacotes genéricos. Cada entrega nasce de um problema concreto, metas claras e integração com a sua operação.
                    </p>
                </div>

                <div className={`solutions__grid ${isInView ? 'in-view' : ''}`} role="list">
                    {solutions.map((solution, i) => (
                        <article
                            key={i}
                            className="solutions__card"
                            style={{ transitionDelay: `${200 + i * 80}ms` }}
                            role="listitem"
                        >
                            <div className="solutions__card-icon" aria-hidden="true">{solution.icon}</div>
                            <h3 className="solutions__card-title">{solution.title}</h3>
                            <p className="solutions__card-description">{solution.description}</p>
                            <div className="solutions__card-arrow" aria-hidden="true">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Solutions;
