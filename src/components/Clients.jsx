import './Clients.css';

const clients = [
    {
        name: 'Sadi Morishita',
        logo: 'https://sadimorishita.com.br/wp-content/uploads/2023/09/sm-barra_1.png',
    },
    {
        name: 'Seu Perito',
        logo: 'https://seuperito.com.br/wp-content/uploads/logo-seu-perito-768x118.webp',
    },
    {
        name: 'Gorila',
        logo: 'https://gorila.com.br/wp-content/uploads/cropped-Logotipo_Gorila_Final_Color-1.png',
    },
    {
        name: 'AASP',
        logo: 'https://conheca.aasp.org.br/wp-content/uploads/2024/01/AASP001.Logomarca_Pos_RGB-1024x394.png',
    },
    {
        name: 'Intercafé',
        logo: '/intercafe.png',
        large: true,
    },
    {
        name: 'Agencia Unobvious',
        logo: '/UNB-Logos coloridos com slogam_4 copy.png',
        large: true,
    },
    {
        name: 'GiantSteps',
        logo: 'https://gscap.com.br/wp-content/uploads/2019/07/logo_gscap_402x118.png',
    },

];

const Clients = () => {
    return (
        <section className="clients" aria-label="Clientes atendidos">
            <div className="container">
                <p className="clients__label">Empresas que confiam em nós</p>
                <div className="clients__track">
                    <div className="clients__slider">
                        <div className="clients__slider-group">
                            {clients.map((client, i) => (
                                <div className={`clients__item ${client.large ? 'clients__item--large' : ''}`} key={i}>
                                    <img
                                        src={client.logo}
                                        alt={client.name}
                                        className="clients__logo"
                                        loading="lazy"
                                        draggable="false"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="clients__slider-group" aria-hidden="true">
                            {clients.map((client, i) => (
                                <div className={`clients__item ${client.large ? 'clients__item--large' : ''}`} key={`dup-${i}`}>
                                    <img
                                        src={client.logo}
                                        alt=""
                                        className="clients__logo"
                                        loading="lazy"
                                        draggable="false"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Clients;
