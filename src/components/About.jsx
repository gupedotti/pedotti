import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import './About.css';

const AnimatedStat = ({ target, suffix, label, isInView }) => {
    const count = useCountUp(target, 2000, isInView);
    return (
        <div className="about__stat">
            <span className="about__stat-number">
                {count}{suffix}
            </span>
            <span className="about__stat-label">{label}</span>
        </div>
    );
};

const stats = [
    { target: 50, suffix: '+', label: 'Projetos Entregues' },
    { target: 98, suffix: '%', label: 'Taxa de Satisfação' },
    { target: 3, suffix: 'x', label: 'ROI Médio' },
    { target: 24, suffix: '/7', label: 'Suporte Ativo' },
];

const About = () => {
    const [ref, isInView] = useInView();

    return (
        <section className="about section" id="sobre" ref={ref}>
            <div className="container">
                <div className={`about__grid ${isInView ? 'in-view' : ''}`}>
                    <div className="about__text">
                        <span className="about__label">Sobre Nós</span>
                        <h2 className="about__title">
                            Conectamos IA ao mundo <span className="text-gradient">real</span>
                        </h2>
                        <p className="about__description">
                            Somos uma agência especializada em inteligência artificial aplicada.
                            Não vendemos tecnologia — entregamos soluções que funcionam.
                            Cada projeto começa com o entendimento profundo do seu negócio
                            e termina com resultados mensuráveis.
                        </p>
                        <p className="about__description">
                            Nossa equipe combina expertise técnica em machine learning,
                            processamento de linguagem natural e automação com visão
                            estratégica de negócios.
                        </p>
                    </div>

                    <div className="about__stats">
                        {stats.map((stat, i) => (
                            <AnimatedStat
                                key={i}
                                target={stat.target}
                                suffix={stat.suffix}
                                label={stat.label}
                                isInView={isInView}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
