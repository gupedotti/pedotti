import { useInView } from '../hooks/useInView';
import './Process.css';

const steps = [
    {
        number: '01',
        title: 'Diagnóstico',
        description: 'Investigamos operação, dados, gargalos e alavancas para identificar onde a IA gera retorno com menos fricção e mais velocidade.',
    },
    {
        number: '02',
        title: 'Estratégia',
        description: 'Definimos caso de uso, arquitetura, integrações, metas de performance e escopo executivo antes de qualquer desenvolvimento.',
    },
    {
        number: '03',
        title: 'Desenvolvimento',
        description: 'Construímos a solução com dados reais, ciclos curtos de validação e foco em aderência operacional, não em laboratório.',
    },
    {
        number: '04',
        title: 'Implantação',
        description: 'Colocamos a IA em produção, monitoramos desempenho e refinamos continuamente para sustentar resultado ao longo do tempo.',
    },
];

const Process = () => {
    const [ref, isInView] = useInView();

    return (
        <section className="process section" id="processo" ref={ref} aria-labelledby="process-title">
            <div className="container">
                <div className={`process__header ${isInView ? 'in-view' : ''}`}>
                    <span className="process__label">Método</span>
                    <h2 className="process__title" id="process-title">
                        Da oportunidade ao impacto com <span className="text-gradient">método e controle</span>
                    </h2>
                    <p className="process__subtitle">
                        Um processo claro para reduzir risco, acelerar a execução e transformar IA em entrega mensurável.
                    </p>
                </div>

                <ol className={`process__steps ${isInView ? 'in-view' : ''}`}>
                    {steps.map((step, i) => (
                        <li
                            key={i}
                            className="process__step"
                            style={{ transitionDelay: `${300 + i * 150}ms` }}
                        >
                            <div className="process__step-number" aria-hidden="true">{step.number}</div>
                            <div className="process__step-content">
                                <h3 className="process__step-title">{step.title}</h3>
                                <p className="process__step-description">{step.description}</p>
                            </div>
                            {i < steps.length - 1 && <div className="process__step-connector" aria-hidden="true" />}
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

export default Process;
