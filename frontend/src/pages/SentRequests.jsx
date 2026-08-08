import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

const SentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (e) {
      return "Date inconnue";
    }
  };

  useEffect(() => {
    const fetchSent = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/requests/sent",
          { withCredentials: true }
        );
        const sorted = data.data.sort(
          (a, b) => parseISO(b.createdAt) - parseISO(a.createdAt)
        );
        setRequests(sorted);
        setLoading(false);
      } catch (err) {
        console.error("Erreur récupération demandes envoyées", err);
        setError("Erreur lors du chargement de vos demandes envoyées.");
        setLoading(false);
      }
    };
    fetchSent();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-mauve-clair text-mauve-fonce border-mauve-fonce/40";
      case "ACCEPTED":
        return "bg-mauve-fonce text-blanc border-mauve-fonce";
      case "REJECTED":
        return "bg-blanc text-mauve-fonce border-mauve-fonce";
      default:
        return "bg-mauve-clair text-mauve-fonce/70 border-mauve-clair";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "ACCEPTED":
        return "Acceptée";
      case "REJECTED":
        return "Refusée";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-mauve-fonce border-t-transparent"></div>
        <p className="ml-4 text-lg text-mauve-fonce/70">
          Chargement de vos demandes...
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
    <div className="px-6 max-w-4xl mx-auto pt-8">
      <h1 className="text-4xl font-extrabold mb-8 text-mauve-fonce border-b border-mauve-clair pb-3">
        Mes demandes envoyées ({requests.length})
      </h1>

      {requests.length === 0 ? (
        <div className="text-center text-mauve-fonce/70 mt-20 p-8 bg-blanc rounded-xl shadow-lg border border-mauve-clair">
          <p className="text-xl font-medium">
            Vous n'avez encore envoyé aucune demande.
          </p>
          <p className="mt-2 text-md">
            Parcourez les annonces pour proposer un échange !
          </p>
          <Link
            to="/announcements"
            className="inline-block mt-4 bg-mauve-fonce hover:bg-mauve-fonce/90 text-blanc font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Voir les annonces
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-blanc rounded-xl shadow-lg p-6 transition duration-300 hover:shadow-xl border border-mauve-clair"
            >
              <div className="flex justify-between items-start mb-4 border-b border-mauve-clair pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-mauve-fonce">
                    {req.ad?.title || "Annonce supprimée"}
                  </h2>
                  <p className="text-sm text-mauve-fonce/70 mt-1">
                    Envoyée à{" "}
                    <span className="font-semibold text-mauve-fonce">
                      {req.toUser?.firstName} {req.toUser?.lastName}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-bold border ${getStatusStyle(
                      req.status
                    )}`}
                  >
                    {getStatusLabel(req.status)}
                  </span>
                  {req.createdAt && (
                    <p className="text-xs text-mauve-fonce/70 mt-1">
                      Envoyée {formatDate(req.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <p className="text-lg font-medium text-mauve-fonce mb-2">
                  Votre message :
                </p>
                <div className="bg-mauve-clair p-4 rounded-lg border border-mauve-clair">
                  <p className="text-mauve-fonce/80 italic leading-relaxed">
                    {req.message}
                  </p>
                </div>
              </div>

              {req.status === "ACCEPTED" && req.ad && (
                <p className="mt-4 text-sm font-medium text-mauve-fonce">
                  Votre demande a été acceptée, retrouvez la conversation dans
                  <Link
                    to="/dashboard/demandes"
                    className="ml-1 underline underline-offset-2 hover:text-mauve-fonce/80"
                  >
                    Messages
                  </Link>
                  .
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentRequests;
