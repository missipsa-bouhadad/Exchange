import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

// returns the list of favorite ad ids for the current user
const useFavorites = () => {
  const user = useSelector((state) => state.auth.user);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    let cancelled = false;
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/user/favorites",
          { withCredentials: true }
        );
        if (!cancelled && data.success) {
          setFavorites(data.data.map((ad) => ad._id));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching favorites:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFavorites();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isFavorite = useCallback(
    (adId) => favorites.includes(adId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (adId) => {
      if (!user) {
        toast.error("Vous devez être connecté pour ajouter un favori.");
        return;
      }
      try {
        const { data } = await axios.post(
          `http://localhost:8000/api/v1/user/favorites/${adId}`,
          {},
          { withCredentials: true }
        );
        if (data.success) {
          setFavorites((prev) =>
            data.added
              ? [...prev, adId]
              : prev.filter((id) => id !== adId)
          );
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Erreur lors de la mise à jour des favoris."
        );
      }
    },
    [user]
  );

  return { favorites, loading, isFavorite, toggleFavorite };
};

export default useFavorites;
