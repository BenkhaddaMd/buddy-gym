import React from "react";

const SessionCard = ({ session }) => {

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* Image */}
      <img
        src="/images/Personal-Trainer-amico.png"
        alt="sport illustration"
        className="w-full h-40 object-cover"
      />

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-blue-700">{session.sport}</h3>
          <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
            {session.date}
          </span>
        </div>

        <p className="text-gray-600 text-sm">
          📍 <span className="font-medium">{session.location}</span>
        </p>

        <p className="text-sm text-gray-500">🕒 {session.time}</p>

        <p className="text-sm text-gray-500">
          👥 0/{session.max_participants} participants
        </p>

        <p className="text-sm italic text-gray-400">
          Créée par <strong>{session.creator}</strong>
        </p>
      </div>
    </div>
  );
};

export default SessionCard;