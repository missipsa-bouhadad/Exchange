import React from 'react';
import { Link } from 'react-router-dom';
import UpdateAdModal from "@/components/ui/UpdateAdModal.jsx";
import RemovalConfirmation from "@/components/ui/RemovalConfirmation.jsx";

const AdCard = ({ ad, isUserAd, onDeleteSuccess}) => {
    const isSkill = ad.type === 'SKILL';

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">

            {/* ZONE VISUELLE DU HAUT (Image ou Icône) */}
            <div className="relative h-48 w-full">

                {isSkill || !ad.imageUrl ? (
                    /* CAS COMPÉTENCE : Fond coloré + Icône */
                    <div className="w-full h-full bg-gradient-to-br bg-cyan-800 flex items-center justify-center">
                        {/* Icône SVG représentant l'entraide/service */}
                        <svg className="w-20 h-20 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                ) : (
                    /* CAS OBJET : Image réelle */
                    <img
                        src={ad.imageUrl || "https://via.placeholder.com/400x300?text=Pas+d'image"}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Badge Type (Toujours affiché pour info) */}
                <span className={`absolute top-2 right-2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm ${isSkill ? 'bg-white/20 backdrop-blur-sm' : 'bg-green-600'}`}>
          {isSkill ? 'Compétence' : 'Objet'}
        </span>
            </div>

            {/* RESTE DU CONTENU (Identique) */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {ad.category}
          </span>
                    <h3 className="text-xl font-bold text-gray-800 mt-1 truncate">
                        {ad.title}
                    </h3>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {ad.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    { isUserAd ? (
                        <div className="flex gap-2 w-full justify-end">
                            <RemovalConfirmation
                                ad={ad}
                                onDeleteSuccess={onDeleteSuccess} // <--- PASSAGE DE RELAIS IMPORTANT
                            />

                            <UpdateAdModal ad={ad}/>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center text-gray-500 text-sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                {ad.city || 'Inconnue'}
                            </div>

                            <Link
                                to={`/ad/${ad._id}`}
                                className="bg-cyan-950 hover:bg-cyan-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm inline-block text-center"
                            >
                                Voir détails
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdCard;