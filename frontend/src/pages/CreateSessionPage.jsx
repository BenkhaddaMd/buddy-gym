import { useEffect, useState } from "react";
import matchingApi from "../api/matchingApi";

export default function CreateSessionPage() {
  const [formData, setFormData] = useState({
    sport: "",
    location: "",
    date: "",
    time: "",
    max_participants: 10,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sports, setSports] = useState([]);

  const { sport, location, date, time, max_participants } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchSportsList = async () => {
    try {
      const response = await matchingApi.getSportsList();
      setSports(response);
    } catch (error) {
      console.error("Error fetching sports list:", error);
      setError("Impossible de charger la liste des sports.");
    }
  }

  useEffect(() => {
    fetchSportsList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");    

    try {
        console.log(formData);

      await matchingApi.createSession(formData);

      setSuccess("Session créée avec succès !");
      setFormData({
        sport: "",
        location: "",
        date: "",
        time: "",
        max_participants: 10,
      });
    } catch (err) {
      setError(err.detail || "Une erreur est survenue.");
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* 📝 Formulaire */}
          <div>
            <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
              Organise ta prochaine séance avec notre communauté
            </h1>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Sport</label>
                <select name="sport" id="sport" value={sport} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Sélectionner un sport</option>
                  {sports.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Lieu</label>
                <input
                  type="text"
                  name="location"
                  value={location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Parc Monceau, Salle Fitness..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Heure</label>
                  <input
                    type="time"
                    name="time"
                    value={time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Nombre max de participants
                </label>
                <input
                  type="number"
                  name="max_participants"
                  value={max_participants}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200"
                >
                  Créer la session
                </button>
              </div>
            </form>
          </div>

          {/* 📷 Image illustrée */}
          <div className="hidden md:block">
            <img
              src="/images/PersonalTrainer.gif"
              alt="Illustration séance"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
