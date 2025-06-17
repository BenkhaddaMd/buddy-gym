import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to BuddyGym!</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your ultimate fitness companion with production-level authentication!
          </p>

          {!isAuthenticated && (
            <>
              <p className="text-gray-500 mb-8">
                Click Sign In to access your workouts or Sign Up to join our fitness community.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Link
                  to="/login"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg shadow-sm hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}

          {isAuthenticated && (
            <div className="mt-8">
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img 
              src="/images/Fitness-tracker.gif" 
              alt="Fitness Tracker" 
              className="mx-auto" 
            />
            <h3 className="font-semibold text-lg mb-2">Track Workouts</h3>
            <p className="text-gray-600">Log and monitor your fitness progress with ease.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <img 
              src="/images/Stability-ball.gif" 
              alt="Find Buddies" 
              className="mx-auto" 
            />
            <h3 className="font-semibold text-lg mb-2">Find Buddies</h3>
            <p className="text-gray-600">Connect with workout partners in your area.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <img 
              src="/images/progres-analytics.gif" 
              alt="Progress Analytics" 
              className="mx-auto" 
            />
            <h3 className="font-semibold text-lg mb-2">Progress Analytics</h3>
            <p className="text-gray-600">Visualize your fitness journey with detailed stats.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;