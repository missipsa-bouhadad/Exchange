import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdCard from '../components/ui/AdCard';
import { Link } from 'react-router-dom';
import {useSelector} from "react-redux";

const UserAnnouncements = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector(store => store.auth)

    const removeAdFromList = (deletedAdId) => {
        setAds(ads.filter(ad => ad._id !== deletedAdId));
    };

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8000/api/v1/ad/user/' + user._id,
                    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
                );
                setAds(response.data.userAds);
                console.log(ads)
                setLoading(false);
            } catch (err) {
                console.error("Erreur API:", err);
                setError("Oups ! Impossible de charger les annonces.");
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    // Affichage du chargement avec une animation Tailwind (pulse)
    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 mt-10 text-lg font-semibold bg-red-50 p-4 rounded-md mx-auto max-w-md border border-red-200">
            {error}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-25">
            {/* Titre de la section */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Vos Annonces
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                    Gérez et consultez toutes vos annonces publiées ici.
                </p>
            </div>

            {!ads ? (
                <div className="text-center text-gray-500 text-xl mt-10 bg-gray-50 p-10 rounded-xl">
                    Vous n'avez pas encore publié d'annonces.
                </div>
            ) : (
                /* Grille Responsive Tailwind */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ads.map((ad) => (
                        <AdCard key={ad._id} ad={ad} isUserAd={user._id === ad.user} onDeleteSuccess={removeAdFromList}/>
                    ))}
                </div>
            )}

            <Link
                to="/create-ad"
                className="fixed bottom-8 right-8 z-50 bg-cyan-950 hover:bg-cyan-800 text-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
                title="Créer une annonce"
            >
                {/* Icône Plus (+) */}
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>

                {/* Texte qui apparaît au survol (Optionnel, effet sympa) */}
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap group-hover:ml-2 font-bold">
                    Créer une annonce
                </span>
            </Link>
        </div>
    );
};

export default UserAnnouncements;