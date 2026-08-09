import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Star } from "lucide-react";
import RatingModal from "@/components/ui/RatingModal";



const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [ratingRequestId, setRatingRequestId] = useState(null);
  const [ratedIds, setRatedIds] = useState(new Set());

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (e) {
      console.error("Erreur de formatage de la date:", e);
      return "Date inconnue";
    }
  };


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/requests/received",
          { withCredentials: true }
        );
        const sortedRequests = data.data.sort((a, b) => {
          if (a.status === "PENDING" && b.status !== "PENDING") return -1;
          if (a.status !== "PENDING" && b.status === "PENDING") return 1;
          return parseISO(b.createdAt) - parseISO(a.createdAt);
        });
        setRequests(sortedRequests);
        setLoading(false);
      } catch (err) {
        console.error("Erreur récupération demandes", err);
        setError("Erreur lors du chargement des demandes. Veuillez réessayer.");
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Load existing ratings for accepted requests
  useEffect(() => {
    const loadMyRatings = async () => {
      try {
        const rated = new Set();
        await Promise.all(
          requests
            .filter((r) => r.status === "ACCEPTED")
            .map(async (r) => {
              try {
                const { data: rd } = await axios.get(
                  `http://localhost:8000/api/v1/ratings/request/${r._id}/me`,
                  { withCredentials: true }
                );
                if (rd.data) rated.add(r._id);
              } catch {}
            })
        );
        setRatedIds(rated);
      } catch (err) {
        // silent
      }
    };
    loadMyRatings();
  }, [requests]);

  const acceptRequest = async (id) => {
    try {
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "ACCEPTED" } : req
        )
      );

      const { data } = await axios.post(
        `http://localhost:8000/api/v1/requests/${id}/accept`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        navigate(`/dashboard/messages`, {
          state: { selectedChatId: data.chat._id },
        });
      }
    } catch (err) {
      console.error("Erreur acceptation demande", err);
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "PENDING" } : req
        )
      );
      toast.error("Une erreur est survenue lors de l'acceptation.");
    }
  };

  const rejectRequest = async (id) => {
    try {
      setRequests((prev) => prev.filter((req) => req._id !== id));

      await axios.post(
        `http://localhost:8000/api/v1/requests/${id}/reject`,
        {},
        { withCredentials: true }
      );

    } catch (err) {
      toast.error("Une erreur est survenue lors du rejet.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-mauve-clair text-mauve-fonce border-mauve-fonce/30";
      case "ACCEPTED":
        return "bg-mauve-clair text-mauve-fonce border-mauve-fonce/40";
      case "REJECTED":
        return "bg-mauve-clair text-mauve-fonce border-mauve-fonce";
      default:
        return "bg-mauve-clair text-mauve-fonce/70 border-mauve-clair";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-mauve-fonce border-t-transparent"></div>
        <p className="ml-4 text-lg text-mauve-fonce/70">Chargement des demandes...</p>
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
    <div className="px-6 max-w-4xl mx-auto pt-20">
      <h1 className="text-4xl font-extrabold mb-8 text-mauve-fonce border-b border-mauve-clair pb-3">
        Demandes reçues ({requests.length})
      </h1>

      {requests.length === 0 ? (
        <div className="text-center text-mauve-fonce/70 mt-20 p-8 bg-blanc rounded-xl shadow-lg border border-mauve-clair">
          <p className="text-xl font-medium">Aucune demande pour le moment.</p>
          <p className="mt-2 text-md">Revenez plus tard !</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className={`bg-blanc rounded-xl shadow-lg p-6 transition duration-300 hover:shadow-xl ${
                req.status === "PENDING"
                  ? "border-2 border-mauve-fonce"
                  : "border border-mauve-clair"
              }`}
            >
              <div className="flex justify-between items-start mb-4 border-b border-mauve-clair pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-mauve-fonce flex items-center">
                    {req.fromUser.firstName} {req.fromUser.lastName}
                    {req.status === "PENDING" && (
                      <span className="ml-3 text-sm font-semibold text-mauve-fonce bg-mauve-clair px-3 py-1 rounded-full">
                        Nouvelle
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-mauve-fonce/70 mt-1">
                    Titre :{" "}
                    <span className="font-semibold text-mauve-fonce">
                      {req.ad.title}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-bold border ${getStatusStyle(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>
                  {req.createdAt && (
                    <p className="text-xs text-mauve-fonce/70 mt-1">
                      Reçue il y a {formatDate(req.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-lg font-medium text-mauve-fonce mb-2">
                  Objet souhaité en retour :
                </p>
                <div className="bg-mauve-clair p-4 rounded-lg border border-mauve-clair">
                  <p className="text-mauve-fonce/80 italic leading-relaxed">
                    {req.message}
                  </p>
                </div>
              </div>

              {req.status === "PENDING" && (
                <div className="flex gap-4 pt-4 border-t border-mauve-clair">
                  <button
                    onClick={() => acceptRequest(req._id)}
                    className="flex-1 flex items-center justify-center bg-mauve-clair hover:bg-mauve-fonce hover:text-blanc text-mauve-fonce font-semibold px-6 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                  >
                    Accepter l'échange
                  </button>

                  <button
                    onClick={() => rejectRequest(req._id)}
                    className="flex-1 flex items-center justify-center bg-mauve-fonce hover:bg-mauve-fonce/90 text-blanc font-semibold px-6 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                  >
                    Refuser l'échange
                  </button>
                </div>
              )}
              {req.status !== "PENDING" && (
                <div className="pt-4 border-t border-mauve-clair flex items-center justify-between">
                  <p
                    className={`text-center font-medium ${
                      req.status === "ACCEPTED"
                        ? "text-mauve-fonce"
                        : "text-mauve-fonce/50 line-through"
                    }`}
                  >
                    {req.status === "ACCEPTED"
                      ? "Requête acceptée"
                      : "Requête refusée"}
                  </p>
                  {req.status === "ACCEPTED" &&
                    !ratedIds.has(req._id) && (
                      <button
                        onClick={() => {
                          setRatingRequestId(req._id);
                          setRatingOpen(true);
                        }}
                        className="flex items-center gap-1 bg-mauve-fonce hover:bg-mauve-fonce/90 text-blanc text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        <Star className="w-4 h-4" /> Noter
                      </button>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <RatingModal
        open={ratingOpen}
        onOpenChange={setRatingOpen}
        requestId={ratingRequestId}
        onSuccess={() => {
          if (ratingRequestId) {
            setRatedIds((prev) => new Set([...prev, ratingRequestId]));
          }
        }}
      />
    </div>
  );
};

export default Requests;
