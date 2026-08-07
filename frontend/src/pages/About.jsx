import React from "react";

const About = () => {
  return (
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-6xl">
      <div className="text-center mb-16">

        <h1 className="text-4xl inline-block text-mauve-fonce bg-mauve-clair px-7 py-2 rounded-full font-semibold mb-4">
          Une plateforme d'échange locale et solidaire
        </h1>
        <p className="text-mauve-fonce/80 max-w-3xl mx-auto text-lg">
          Cette application a pour objectif de renforcer les liens entre voisins
          en facilitant le partage de biens et de compétences, tout en
          favorisant une consommation plus responsable.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-20">
        <div className="bg-blanc rounded-2xl shadow-lg p-8 border border-mauve-clair">
          <h2 className="text-2xl font-bold text-mauve-fonce mb-4 flex items-center">
            Notre mission
          </h2>
          <p className="text-mauve-fonce/80 leading-relaxed">
            Construire des communautés plus solidaires en mettant en relation
            des personnes vivant à proximité afin qu'elles puissent échanger des
            objets du quotidien ou proposer leurs compétences.
            <br />
            <br />
            L'objectif est de réduire le gaspillage, encourager l'entraide
            locale et créer des interactions humaines basées sur la confiance.
          </p>
        </div>

        <div className="bg-mauve-fonce text-blanc rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            Pourquoi cette application ?
          </h2>
          <p className="leading-relaxed text-blanc/90">
            Dans un monde de plus en plus numérique, cette plateforme remet
            l'humain au centre des échanges.
            <br />
            <br />
            Elle permet de valoriser les compétences de chacun, d'éviter des
            achats inutiles et de renforcer la confiance entre utilisateurs
            grâce à un système de demandes et d'échanges encadrés.
          </p>
        </div>
      </div>
      <div className="mb-20">
        <h2 className="text-3xl font-extrabold text-center text-mauve-fonce mb-12">
          Fonctionnalités
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Annonces d'objets & compétences",
              desc: "Publiez des objets à prêter ou des compétences à offrir en quelques clics.",
            },
            {
              title: "Demandes d'échange",
              desc: "Contactez les utilisateurs et proposez un échange personnalisé.",
            },
            {
              title: "Sécurité & confiance",
              desc: "Accès sécurisé, authentification, protection des données.",
            },
            {
              title: "Localisation",
              desc: "Découvrez des annonces proches de chez vous.",
            },
            {
              title: "Messagerie et notifications",
              desc: "Restez informé des demandes et échanges en temps réel.",
            },
            {
              title: "Interface moderne",
              desc: "Une expérience utilisateur fluide, claire et responsive.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-blanc p-6 rounded-2xl shadow-md border border-mauve-clair hover:shadow-xl hover:border-mauve-fonce transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-mauve-fonce mb-2">
                {feature.title}
              </h3>
              <p className="text-mauve-fonce/80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-20 text-mauve-fonce/70">
        <p className="text-sm mt-2">
          © {new Date().getFullYear()} — Application d'échange local
        </p>
      </div>
    </div>
  );
};

export default About;