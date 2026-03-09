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
    { target: 50, suffix: '+', label: 'operações analisadas' },
    { target: 98, suffix: '%', label: 'aderência à implementação' },
    { target: 3, suffix: 'x', label: 'potencial médio de ganho' },
    { target: 24, suffix: '/7', label: 'monitoramento contínuo' },
];

const About = () => {
    const [ref, isInView] = useInView();

    return (
        <section className="about section" id="sobre" ref={ref}>
            <div className="container">
                <div className={`about__grid ${isInView ? 'in-view' : ''}`}>
                    <div className="about__text">
                        <span className="about__label">Sobre nós</span>
                        <h2 className="about__title">
                            Estratégia, dados e execução em um nível <span className="text-gradient">AAA</span>
                        </h2>
                        <p className="about__description">
                            Somos uma agência de soluções em IA para empresas que não querem experimentar tecnologia,
                            mas capturar valor real. Entramos no negócio, entendemos o contexto operacional e desenhamos
                            uma solução que faça sentido para a sua realidade, seu time e sua margem.
                        </p>
                        <p className="about__description">
                            Nossa atuação combina diagnóstico estratégico, arquitetura de dados, automação inteligente
                            e implantação assistida. O foco não é entregar um protótipo bonito: é colocar IA para operar,
                            reduzir atrito e aumentar performance com previsibilidade.
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
