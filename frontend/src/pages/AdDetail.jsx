import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdDetail = () => {
    const { id } = useParams();
    console.log(id)
    const navigate = useNavigate();

    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/ad/${id}`);
                setAd(response.data);
                console.log(ad)
                setLoading(false);
            } catch (err) {
                console.error("Erreur:", err);
                setError("NOT_FOUND");
                setLoading(false);
            }
        };
        fetchAdDetail();
    }, [id]);

    if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    //if (error) return <div className="text-center mt-20 text-red-500 font-bold">{error}</div>;
    if (error === "NOT_FOUND") return (
        <div className="flex flex-col items-center justify-center py-30 text-center px-4">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Annonce introuvable</h2>
            <p className="text-gray-600 mb-6">Cette annonce a été supprimée ou n'existe pas.</p>
            <button
                onClick={() => navigate('/announcements')}
                className="bg-cyan-950 hover:bg-cyan-800 text-white px-6 py-2 rounded-lg transition-colors"
            >
                Retourner aux annonces
            </button>
        </div>
    );
    if(!ad) return null;

    const isSkill = ad.type === 'SKILL';

    const isAvailable = ad.status === 'AVAILABLE';

    return (
        <div className="container mx-auto px-4 py-25 max-w-5xl">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Retour aux annonces
            </button>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2">

                    {/* COLONNE GAUCHE : VISUEL */}
                    <div className="h-64 md:h-auto relative">
                        {isSkill || !ad.imageUrl ? (
                            <div className={`w-full h-full bg-cyan-800 flex items-center justify-center p-10`}>
                                <svg className="w-32 h-32 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        ) : (
                            <img
                                src={ad.imageUrl || "https://via.placeholder.com/600x600?text=Pas+d'image"}
                                alt={ad.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                        {/* Badge Type */}
                        <span className={`absolute top-4 left-4 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md ${isSkill ? 'bg-black/20 backdrop-blur-md' : 'bg-green-600'}`}>
                {isSkill ? 'Compétence à offrir' : 'Objet à prêter/donner'}
            </span>
                    </div>

                    {/* COLONNE DROITE : INFOS */}
                    <div className="p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                <span className={`text - sm font-bold text-white uppercase tracking-wide ${isAvailable ? 'bg-green-800' : 'bg-red-800'} px-3 py-1 rounded-md`}>
                  {ad.status === 'AVAILABLE' ? 'Disponible' : 'Indisponible'}
                </span>
                                <span className="text-gray-400 text-sm flex items-center">
                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Publié récemment
                </span>
                            </div>

                            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{ad.title}</h1>

                            <div className="prose text-gray-600 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                <p className="whitespace-pre-line leading-relaxed">{ad.description}</p>
                            </div>

                            <div className="flex items-center text-gray-700 font-medium mb-8 bg-gray-50 p-4 rounded-lg">
                                <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                {ad.city || 'Localisation non spécifiée'}
                            </div>
                        </div>

                        {/* Actions / Footer */}
                        <div className="border-t pt-6">
                            {/* Ici, tu pourras ajouter la photo de l'auteur plus tard */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Proposé par</p>
                                    <p className="font-bold text-gray-900">{ad.user.firstName} {ad.user.lastName}</p>
                                </div>
                                <button className="bg-cyan-950 hover:bg-cyan-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl">
                                    Contacter / Échanger
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdDetail;