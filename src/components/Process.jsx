import { useInView } from '../hooks/useInView';
import './Process.css';

const steps = [
    {
        number: '01',
        title: 'Diagnóstico',
        description: 'Entendemos profundamente seu negócio, seus dados e seus desafios para identificar onde a IA pode gerar mais impacto.',
    },
    {
        number: '02',
        title: 'Estratégia',
        description: 'Desenhamos a solução ideal com tecnologia, arquitetura, cronograma e métricas de sucesso bem definidos.',
    },
    {
        number: '03',
        title: 'Desenvolvimento',
        description: 'Construímos e treinamos os modelos com dados reais, iterando rapidamente com feedback contínuo.',
    },
    {
        number: '04',
        title: 'Implantação',
        description: 'Integramos a solução ao seu ecossistema com monitoramento em tempo real e suporte dedicado.',
    },
];

const Process = () => {
    const [ref, isInView] = useInView();

    return (
        <section className="process section" id="processo" ref={ref}>
            <div className="container">
                <div className={`process__header ${isInView ? 'in-view' : ''}`}>
                    <span className="process__label">Processo</span>
                    <h2 className="process__title">
                        Do diagnóstico ao <span className="text-gradient">resultado</span>
                    </h2>
                    <p className="process__subtitle">
                        Um processo estruturado que garante qualidade e previsibilidade em cada etapa.
                    </p>
                </div>

                <div className={`process__steps ${isInView ? 'in-view' : ''}`}>
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="process__step"
                            style={{ transitionDelay: `${300 + i * 150}ms` }}
                        >
                            <div className="process__step-number">{step.number}</div>
                            <div className="process__step-content">
                                <h3 className="process__step-title">{step.title}</h3>
                                <p className="process__step-description">{step.description}</p>
                            </div>
                            {i < steps.length - 1 && <div className="process__step-connector" />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
