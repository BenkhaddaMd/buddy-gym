import React, { useEffect, useState } from "react";
import sessionService from "../api/sessionApi";
import SessionCard from "../components/SessionCard";
import SessionModal from "../components/SessionModal";

const SessionListPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null); // pour le modal

  useEffect(() => {
    sessionService
      .getSessionList()
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des sessions :", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Available Sessions
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Chargement...</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-gray-600">Aucune session disponible.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => setSelectedSession(session)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onParticipate={async () => {
            try {
              await sessionService.participateInSession(selectedSession.id);
              alert("Participation enregistrée !");
              setSelectedSession(null);
              window.location.reload(); // ou tu peux mettre à jour localement
            } catch (err) {
              alert(err.detail || "Erreur lors de la participation.");
            }
          }}
        />
      )}
    </div>
  );
};

export default SessionListPage;