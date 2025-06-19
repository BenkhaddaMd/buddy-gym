import React, { useEffect, useState } from "react";
import  sessionService from "../api/sessionApi";
import SessionCard from "../components/SessionCard";

const SessionListPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
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
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionListPage;
