import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdCard from '../components/ui/AdCard';
import {useSelector} from "react-redux";
import CreateAdModal from "@/components/ui/CreateAdModal.jsx";
import { Input } from "@/components/ui/input.jsx";

const Announcements = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector(store => store.auth);

    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/ad/ads');
                setAds(response.data.ads);
                setLoading(false);
            } catch (err) {
                console.error("Erreur API:", err);
                setError("Oups ! Impossible de charger les annonces.");
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    const filteredAds = ads.filter((ad) => {
        const matchesType = typeFilter === "ALL" || ad.type === typeFilter;

        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = ad.title.toLowerCase().includes(searchLower);
        const userName = ad.user ? `${ad.user.firstName} ${ad.user.lastName}` : "";
        const matchesUser = userName.toLowerCase().includes(searchLower);

        const matchesSearch = matchesTitle || matchesUser;

        const matchesCity = cityFilter === "" || ad.city.toLowerCase().includes(cityFilter.toLowerCase());

        let matchesDate = true;
        if (dateFilter) {
            const checkDate = new Date(dateFilter);
            const start = new Date(ad.availabilityStart);
            const end = new Date(ad.availabilityEnd);
            matchesDate = checkDate >= start && checkDate <= end;
        }

        return matchesSearch && matchesCity && matchesDate && matchesType;
    });

    const addAdToList = (newAd) => {
        setAds((prevAds) => [newAd, ...prevAds]);
    };


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
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Annonces Récentes
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                    Découvrez les objets et compétences partagés par vos voisins.
                </p>
            </div>

            <div className="flex justify-center mb-6">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex shadow-inner">
                    <button
                        onClick={() => setTypeFilter("ALL")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            typeFilter === "ALL"
                                ? "bg-white text-cyan-950 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Tout voir
                    </button>
                    <button
                        onClick={() => setTypeFilter("GOOD")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                            typeFilter === "GOOD"
                                ? "bg-white text-cyan-950 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        📦 Objets
                    </button>
                    <button
                        onClick={() => setTypeFilter("SKILL")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                            typeFilter === "SKILL"
                                ? "bg-white text-cyan-950 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        🛠️ Compétences
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Rechercher (ex: Perceuse, Thomas...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>

                    <div>
                        <Input
                            type="text"
                            placeholder="Filtrer par ville..."
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                        />
                    </div>

                    <div>
                        <Input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="cursor-pointer"
                        />
                    </div>
                </div>

                <div className="text-right text-xs text-gray-400 mt-2">
                    {filteredAds.length} résultat{filteredAds.length > 1 ? 's' : ''} trouvé{filteredAds.length > 1 ? 's' : ''}
                </div>
            </div>

            {!filteredAds || filteredAds.length === 0 ? (
                <div className="text-center text-gray-500 text-xl mt-10 bg-gray-50 p-10 rounded-xl">
                    {ads.length === 0
                        ? "Aucune annonce disponible pour le moment. Soyez le premier à poster !"
                        : "Aucune annonce ne correspond à votre recherche."}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAds.map((ad) => (
                        <AdCard key={ad._id} ad={ad} />
                    ))}
                </div>
            )}

            {user && (
                <CreateAdModal userLocation={user.location} onCreateSuccess={addAdToList}/>
            )}
        </div>
    );
};

export default Announcements;