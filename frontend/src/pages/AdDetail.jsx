import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import useFavorites from "@/hooks/useFavorites";

const AdDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestInput, setShowRequestInput] = useState(false);
  const [requestedObject, setRequestedObject] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchAdDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/ad/${id}`
        );
        setAd(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur:", err);
        setError("NOT_FOUND");
        setLoading(false);
      }
    };
    fetchAdDetail();
  }, [id]);

  const submitRequest = async () => {
    if (!ad?.user?._id || requestedObject.trim() === "") {
      toast.error("Veuillez remplir le champ de votre demande.");
      return;
    }

    if (ad.status !== "AVAILABLE") {
      toast.error("Cette annonce a déjà été échangée.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/requests",
        { adId: ad._id, message: requestedObject },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Votre demande a bien été envoyée !");
        setShowRequestInput(false);
        setRequestedObject("");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Vous devez être connecté !");
        navigate("/login");
        return;
      }
      toast.error("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mauve-fonce"></div>
      </div>
    );

  if (error === "NOT_FOUND")
    return (
      <div className="flex flex-col items-center justify-center py-30 text-center px-4">
        <div className="bg-mauve-clair p-6 rounded-full mb-4">
          <svg
            className="w-16 h-16 text-mauve-fonce/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-mauve-fonce mb-2">
          Annonce introuvable
        </h2>
        <p className="text-mauve-fonce/80 mb-6">
          Cette annonce a été supprimée ou n'existe pas.
        </p>
        <button
          onClick={() => navigate("/announcements")}
          className="bg-mauve-fonce hover:bg-mauve-fonce/90 text-blanc px-6 py-2 rounded-lg transition-colors"
        >
          Retourner aux annonces
        </button>
      </div>
    );
  if (!ad) return null;

  const isSkill = ad.type === "SKILL";

  const isAvailable = ad.status === "AVAILABLE";

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

  return (
    <div className="container mx-auto px-4 py-25 max-w-5xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-mauve-fonce/80 hover:text-mauve-fonce transition-colors"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Retour aux annonces
      </button>

      <div className="bg-blanc rounded-2xl shadow-lg overflow-hidden border border-mauve-clair">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-64 md:h-auto relative">
            {isSkill || !ad.imageUrl ? (
              <div
                className={`w-full h-full bg-mauve-clair flex items-center justify-center p-10`}
              >
                <svg
                  className="w-32 h-32 text-mauve-fonce opacity-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            ) : (
              <img
                src={
                  ad.imageUrl ||
                  "https://via.placeholder.com/600x600?text=Pas+d'image"
                }
                alt={ad.title}
                className="w-full h-full object-contain"
              />
            )}
            <span
              className={`absolute top-4 left-4 text-blanc text-sm font-bold px-4 py-1.5 rounded-full shadow-md ${
                isSkill ? "bg-mauve-fonce/20 backdrop-blur-md" : "bg-mauve-fonce"
              }`}
            >
              {isSkill ? "Compétence à offrir" : "Objet à prêter/donner"}
            </span>
          </div>

          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`text-sm font-bold text-blanc uppercase tracking-wide ${
                    isAvailable ? "bg-mauve-fonce" : "bg-mauve-clair text-mauve-fonce"
                  } px-3 py-1 rounded-md`}
                >
                  {ad.status === "AVAILABLE" ? "Disponible" : "Échangée"}
                </span>
                <span className="text-mauve-fonce/70 text-sm flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Publiée récemment
                </span>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-3xl font-extrabold text-mauve-fonce leading-tight">
                  {ad.title}
                </h1>
                {ad?.user?._id !== undefined && (
                  <button
                    onClick={() => toggleFavorite(ad._id)}
                    aria-label={
                      isFavorite(ad._id) ? "Retirer des favoris" : "Ajouter aux favoris"
                    }
                    className="p-1 rounded-full hover:bg-mauve-clair transition self-center"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isFavorite(ad._id)
                          ? "fill-mauve-fonce text-mauve-fonce"
                          : "text-mauve-fonce/40"
                      }`}
                    />
                  </button>
                )}
              </div>

              <div className="prose text-mauve-fonce/80 mb-6">
                <h3 className="text-lg font-semibold text-mauve-fonce mb-2">
                  Description
                </h3>
                <p className="whitespace-pre-line leading-relaxed">
                  {ad.description}
                </p>
              </div>

                {ad.exchangeWith && (
                    <div className="my-6 bg-mauve-clair border border-mauve-fonce/30 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-mauve-fonce uppercase mb-1 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                            Souhaité en échange
                        </h3>
                        <p className="text-mauve-fonce italic">
                            "{ad.exchangeWith}"
                        </p>
                    </div>
                )}

              <div className="flex items-center text-mauve-fonce font-medium mb-2 bg-mauve-clair p-4 rounded-lg">
                <svg
                  className="w-6 h-6 mr-3 text-mauve-fonce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                {ad.city || "Localisation non spécifiée"}
              </div>
                <div className="text-xs text-mauve-fonce/70 mb-2 flex items-center bg-mauve-clair p-2 rounded">
                    <svg className="w-4 h-4 mr-1 text-mauve-fonce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Dispo : {formatDate(ad.availabilityStart)} - {formatDate(ad.availabilityEnd)}
                </div>
            </div>

            <div className="border-t border-mauve-clair pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-mauve-fonce/70">Proposé par</p>
                    <p className="font-bold text-mauve-fonce">
                      {ad.user
                        ? `${ad.user.firstName} ${ad.user.lastName}`
                        : "Utilisateur introuvable"}
                    </p>
                  </div>
                  {String(ad.user?._id) === String(currentUser?._id) ? (
                    <span className="text-sm text-mauve-fonce/70 italic">
                      C'est votre annonce
                    </span>
                  ) : (
                    <button
                      onClick={() => setShowRequestInput(true)}
                      disabled={showRequestInput || !isAvailable}
                      className={`font-bold py-3 px-8 rounded-xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl ${
                        showRequestInput || !isAvailable
                          ? "bg-mauve-clair cursor-not-allowed text-mauve-fonce/70"
                          : "bg-mauve-fonce hover:bg-mauve-fonce/90 text-blanc"
                      }`}
                    >
                      {isAvailable ? "Contacter" : "Indisponible"}
                    </button>
                  )}
                </div>
                {showRequestInput && (
                  <div className="mt-4 p-6 border border-mauve-clair rounded-xl shadow-md bg-blanc">
                    <label className="block text-mauve-fonce font-semibold mb-2 text-lg">
                      Objet proposé en retour :
                    </label>

                    <textarea
                      value={requestedObject}
                      onChange={(e) => setRequestedObject(e.target.value)}
                      placeholder="Rédigez votre message ici. Expliquez clairement ce que vous proposez en échange (objet ou service)..."
                      className="w-full p-3 border border-mauve-clair rounded-lg h-32 resize-none focus:ring-2 focus:ring-mauve-clair focus:border-mauve-clair transition duration-150 bg-blanc text-mauve-fonce"
                    ></textarea>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={() => setShowRequestInput(false)}
                        className="bg-mauve-clair hover:bg-mauve-clair/80 text-mauve-fonce px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Annuler
                      </button>

                      <button
                        onClick={submitRequest}
                        className="bg-mauve-fonce text-blanc hover:bg-mauve-fonce/90 px-6 py-2 rounded-lg font-bold transition-colors"
                      >
                        Soumettre la demande
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetail;