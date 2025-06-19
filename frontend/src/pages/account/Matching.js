import { useEffect, useState } from 'react';
import matchingApi from '../../api/matchingApi';

const MatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchingApi.getMatching().then((res) => {
        console.log(res);
        
      setMatches(res);
      setLoading(false);
    }).catch((err) => {
      console.error("Error fetching matches:", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Matching Users</h2>

        {matches.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-600">
            Aucun utilisateur compatible trouvé pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div key={match.user.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600">
                    {match.user.first_name.charAt(0)}{match.user.last_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{match.user.first_name} {match.user.last_name}</p>
                    <p className="text-sm text-gray-500">{match.user.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium text-gray-700">Niveau :</span> {match.level}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Sports en commun :</span>{" "}
                  {match.preferred_sports.map(sport => sport.name).join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingPage;
