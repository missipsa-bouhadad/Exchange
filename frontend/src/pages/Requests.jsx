import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";


const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
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
        navigate(`/dashboard/demandes`, {
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
      alert("Une erreur est survenue lors de l'acceptation.");
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
      console.error("Erreur rejet demande", err);
      alert("Une erreur est survenue lors du rejet.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "ACCEPTED":
        return "bg-green-100 text-green-700 border-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="ml-4 text-lg text-gray-600">Chargement des demandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-red-600 bg-red-50 border border-red-200 rounded-lg mt-10">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="px-6 max-w-4xl mx-auto pt-20">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 border-b pb-3">
        Requests Received ({requests.length})
      </h1>

      {requests.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <p className="text-xl font-medium">
            You have no requests at the moment.
          </p>
          <p className="mt-2 text-md">Come back later !</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className={`bg-white rounded-xl shadow-lg p-6 transition duration-300 hover:shadow-xl ${
                req.status === "PENDING"
                  ? "border-2 border-blue-400"
                  : "border border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4 border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">👤</span>
                    {req.fromUser.firstName} {req.fromUser.lastName}
                    {req.status === "PENDING" && (
                      <span className="ml-3 text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Title :{" "}
                    <span className="font-semibold text-blue-700">
                      {req.ad.title}
                    </span>
                  </p>
                </div>

                {/* Statut et Date */}
                <div className="text-right">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-bold border ${getStatusStyle(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>
                  {req.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Received {formatDate(req.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Message :
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-600 italic leading-relaxed">
                    {req.message}
                  </p>
                </div>
              </div>

              {req.status === "PENDING" && (
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => acceptRequest(req._id)}
                    className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                  >
                    Accept the request
                  </button>

                  <button
                    onClick={() => rejectRequest(req._id)}
                    className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                  >
                    Refuse the request
                  </button>
                </div>
              )}
              {req.status !== "PENDING" && (
                <div className="pt-4 border-t">
                  <p
                    className={`text-center font-medium ${
                      req.status === "ACCEPTED"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {req.status === "ACCEPTED"
                      ? "Request accepted"
                      : "Request refused"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
