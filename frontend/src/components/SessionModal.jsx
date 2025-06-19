import React from "react";
import matchingApi from "../api/matchingApi";

const SessionModal = ({ session, onClose, onParticipate }) => {

    const handleParticipate = async () => {
        try {
            await matchingApi.participateInSession(session.id);
            alert("Participation enregistrée !");
            onClose();
        } catch (err) {
            alert(err.detail || "Erreur lors de la participation.");
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in">

                {/* Image du sport */}
                <img
                    src="/images/Personal-Trainer-amico.png"
                    alt={session.sport}
                    className="w-full h-48 object-cover"
                />

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1 px-2 text-xl"
        >
          X
        </button>

        {/* Contenu */}
        <div className="p-5">
          <h2 className="text-2xl font-bold text-blue-700 mb-1">{session.sport}</h2>
          <p className="text-sm text-gray-600 mb-2">📍 {session.location}</p>
          <p className="text-sm text-gray-600 mb-2">📅 {session.date} — 🕒 {session.time}</p>
          <p className="text-sm text-gray-600 mb-2">
            👥 {session.participants?.length || 0}/{session.max_participants} participants
          </p>

          <div className="text-sm text-gray-500 mb-4">
            <p className="mb-1 font-semibold">Participants :</p>
            <ul className="list-disc list-inside">
              {session.participants?.length > 0 ? (
                session.participants.map((p, i) => <li key={i}>{p}</li>)
              ) : (
                <li>Aucun participant</li>
              )}
            </ul>
          </div>

          <button
            onClick={handleParticipate}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Join  Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;