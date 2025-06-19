import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../store/auth';
import { Link } from 'react-router-dom';
import matchingApi from '../api/matchingApi';
import sessionService from '../api/sessionApi';

const PERIOD_CHOICES = [
  { value: 'matin', label: 'Matin' },
  { value: 'soir', label: 'Soir' },
  { value: 'matin_soir', label: 'Matin et Soir' },
  { value: 'semaine', label: 'Semaine' },
  { value: 'tous', label: 'Tous les jours' },
];

const LEVEL_CHOICES = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [availabilities , setAvailabilities ] = useState([])
  const [newPeriod, setNewPeriod] = useState('');
  const [sportsList, setSportsList] = useState([]);
  const [selectedSports, setSelectedSports] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)


  const fetchSportPreferences = () => {
    matchingApi.getSportPreference().then((res) => {
      setSelectedLevel(res.level)
      setSelectedSports(res.preferred_sports)
      setSelectedTime(res.preferred_time)
    })
  }

  const fetchAvailabilities = () => {
    matchingApi.getAvailabilities().then((res) => {
      setAvailabilities(res)
    })
  }

  const fetchSportsList = async () => {
    try {
      const response = await sessionService.getSportsList();
      setSportsList(response);
    } catch (error) {
      console.error("Error fetching sports list:", error);
    }
  }

  const handleAddSport = () => {

    const data = {
      preferred_sports: selectedSports,
      level: selectedLevel,         
      preferred_time: selectedTime
    };
    
    matchingApi.addSportToPreference(data);
  };

  const handleAdd = () => {
    if (!newPeriod) return; 
    matchingApi.addAvailabilities({ period: newPeriod }).then(res => {
      setAvailabilities(prev => [...prev, res]);
      setNewPeriod('');
    });
  };

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    fetchAvailabilities()
    fetchSportsList()
    fetchSportPreferences()
  }, [])

  const handleDelete = (id) => {
    console.log("Supprimer ID:", id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Available</h2>
          <p className="text-gray-600 mb-6">Please login to view your profile</p>
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Profile Header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold">
              {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-blue-100">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">First Name:</span> {user.first_name || 'Not provided'}</p>
                <p><span className="font-medium">Last Name:</span> {user.last_name || 'Not provided'}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Availability</h3>
              <div className="flex items-center gap-2 mb-4">
                <select
                  className="border rounded px-3 py-2 w-full text-gray-700"
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                >
                  <option value="">-- Choisir une période --</option>
                  {PERIOD_CHOICES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleAdd}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Ajouter
                </button>
              </div>
              <div className="space-y-2">
                {availabilities.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
                    <p><span className="font-medium">Available:</span> {item?.period}</p>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sport Preferences */}
            <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Sport Preferences</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Sports</label>
                  <select
                    multiple
                    value={selectedSports}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
                      setSelectedSports(values);
                    }}
                    className="w-full border px-3 py-2 rounded text-gray-700"
                  >
                    {sportsList.map(sport => (
                      <option key={sport.id} value={sport.id}>{sport.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-gray-700"
                  >
                    {LEVEL_CHOICES.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value + ":00")}
                    className="w-full border px-3 py-2 rounded text-gray-700"
                  />
                </div>

                <div>
                  <button
                    onClick={handleAddSport}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <Link
              to="/profile/edit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ProfilePage;