import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdCard from '../components/ui/AdCard';
import { Link } from 'react-router-dom';
import {useSelector} from "react-redux";
import CreateAdModal from "@/components/ui/CreateAdModal.jsx";

const Announcements = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector(store => store.auth)

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/ad/ads');
                setAds(response.data.ads);
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
                    Annonces Récentes
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                    Découvrez les objets et compétences partagés par vos voisins.
                </p>
            </div>

            {!ads ? (
                <div className="text-center text-gray-500 text-xl mt-10 bg-gray-50 p-10 rounded-xl">
                    Aucune annonce disponible pour le moment. Soyez le premier à poster !
                </div>
            ) : (
                /* Grille Responsive Tailwind */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ads.map((ad) => (
                        <AdCard key={ad._id} ad={ad} />
                    ))}
                </div>
            )}

            {user && (
                <CreateAdModal/>
            )}
        </div>
    );
};

export default Announcements;