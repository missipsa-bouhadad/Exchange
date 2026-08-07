import React from 'react';
import { Link } from 'react-router-dom';
import UpdateAdModal from "@/components/ui/UpdateAdModal.jsx";
import RemovalConfirmation from "@/components/ui/RemovalConfirmation.jsx";

const AdCard = ({ ad, isUserAd, onDeleteSuccess, onUpdateSuccess}) => {
    const isSkill = ad.type === 'SKILL';

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <div className="bg-blanc rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-mauve-clair">

            <div className="relative h-48 w-full">

                {isSkill || !ad.imageUrl ? (
                    <div className="w-full h-full bg-mauve-clair flex items-center justify-center">
                        <svg className="w-20 h-20 text-mauve-fonce opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                ) : (
                    <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-full h-full object-contain p-2"
                    />
                )}

                <span className={`absolute top-2 right-2 text-blanc text-xs font-bold px-3 py-1 rounded-full shadow-sm ${isSkill ? 'bg-mauve-fonce/20 backdrop-blur-sm' : 'bg-mauve-fonce'}`}>
          {isSkill ? 'Compétence' : 'Objet'}
        </span>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-3">
          <span className="text-xs font-semibold text-mauve-fonce/70 uppercase tracking-wide">
            {ad.category}
          </span>
                    <h3 className="text-xl font-bold text-mauve-fonce mt-1 truncate">
                        {ad.title}
                    </h3>
                </div>

                <p className="text-mauve-fonce/80 text-sm mb-4 line-clamp-3 flex-grow">
                    {ad.description}
                </p>

                <div className="text-xs text-mauve-fonce mb-2 flex items-center bg-mauve-clair p-2 rounded">
                    <svg className="w-4 h-4 mr-1 text-mauve-fonce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Dispo : {formatDate(ad.availabilityStart)} - {formatDate(ad.availabilityEnd)}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-mauve-clair">
                    { isUserAd ? (
                        <div className="flex gap-2 w-full justify-end">
                            <RemovalConfirmation
                                ad={ad}
                                onDeleteSuccess={onDeleteSuccess}
                            />

                            <UpdateAdModal
                                ad={ad}
                                onUpdateSuccess={onUpdateSuccess}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center text-mauve-fonce/70 text-sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                {ad.city || 'Inconnue'}
                            </div>

                            <Link
                                to={`/ad/${ad._id}`}
                                className="bg-mauve-fonce hover:bg-mauve-fonce/90 text-blanc text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm inline-block text-center"
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
