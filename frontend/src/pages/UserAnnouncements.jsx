import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdCard from '../components/ui/AdCard';
import { Link } from 'react-router-dom';
import {useSelector} from "react-redux";
import CreateAdModal from "@/components/ui/CreateAdModal.jsx";

const UserAnnouncements = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector(store => store.auth)

    const removeAdFromList = (deletedAdId) => {
        setAds(ads.filter(ad => ad._id !== deletedAdId));
    };

    const addAdToList = (newAd) => {
        setAds((prevAds) => [newAd, ...prevAds]);
    };

    const updateAdInList = (updatedAd) => {
        setAds((prevAds) =>
            prevAds.map((ad) => ad._id === updatedAd._id ? updatedAd : ad)
        );
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ads.map((ad) => (
                        <AdCard key={ad._id}
                                ad={ad}
                                isUserAd={user._id === ad.user}
                                onDeleteSuccess={removeAdFromList}
                                onUpdateSuccess={updateAdInList}
                        />
                    ))}
                </div>
            )}

            <CreateAdModal userLocation={user.location} onCreateSuccess={addAdToList}/>
        </div>
    );
};

export default UserAnnouncements;