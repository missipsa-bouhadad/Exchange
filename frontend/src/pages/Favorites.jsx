import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdCard from "@/components/ui/AdCard";

const Favorites = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/user/favorites",
          { withCredentials: true }
        );
        if (data.success) {
          setAds(data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Erreur lors du chargement de vos favoris.");
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleChange = () => {
    // refetch after a favorite is removed via the card heart icon
    setLoading(true);
    axios
      .get("http://localhost:8000/api/v1/user/favorites", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) setAds(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-mauve-fonce border-t-transparent"></div>
        <p className="ml-4 text-lg text-mauve-fonce/70">
          Chargement des favoris...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-mauve-fonce bg-mauve-clair border border-mauve-fonce/30 rounded-lg mt-10">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="px-6 max-w-6xl mx-auto pt-8">
      <h1 className="text-4xl font-extrabold mb-8 text-mauve-fonce border-b border-mauve-clair pb-3">
        Mes favoris ({ads.length})
      </h1>

      {ads.length === 0 ? (
        <div className="text-center text-mauve-fonce/70 mt-20 p-8 bg-blanc rounded-xl shadow-lg border border-mauve-clair">
          <p className="text-xl font-medium">
            Vous n'avez encore aucun favori.
          </p>
          <p className="mt-2 text-md">
            Cliquez sur le coeur d'une annonce pour l'ajouter à vos favoris.
          </p>
          <Link
            to="/announcements"
            className="inline-block mt-4 bg-mauve-fonce hover:bg-mauve-fonce/90 text-blanc font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Voir les annonces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <AdCard
              key={ad._id}
              ad={ad}
              onDeleteSuccess={handleChange}
              onUpdateSuccess={handleChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
