import './Projects.css';
import { useState, useEffect, useRef } from 'react';

// Você precisará salvar as 2 telas que me enviou na pasta 'public'
// com os nomes 'projeto1.png' e 'projeto2.png'.
const projects = [
    { id: 1, image: '/projeto1.jpg' },
    { id: 2, image: '/projeto2.jpg' },
    { id: 3, image: '/projeto3.jpg' },
    { id: 4, image: '/projeto4.jpg' }
];

const Projects = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const macbookRef = useRef(null);

    useEffect(() => {
        // Intersection observer para identificar quando o notebook aparece na tela
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsOpen(true);
                }
            },
            { threshold: 0.7 } // Aciona quando 70% do laptop já entrou perfeitamente na tela
        );

        if (macbookRef.current) observer.observe(macbookRef.current);

        return () => {
            if (macbookRef.current) observer.unobserve(macbookRef.current);
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % projects.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="projects section-padding" aria-label="Projetos Recentes" id="projetos">
            <div className="container">
                <div className={`projects__macbook ${isOpen ? 'is-open' : ''}`} ref={macbookRef}>
                    <div className="projects__macbook-screen">
                        <div className="projects__screen-content">
                            {projects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className={`projects__screen-slide ${index === currentIndex ? 'active' : ''}`}
                                    style={{
                                        backgroundImage: `url(${project.image})`
                                    }}
                                    aria-hidden={index !== currentIndex}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="projects__macbook-base">
                        <div className="projects__macbook-notch"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
