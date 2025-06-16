import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    profilePic: "https://via.placeholder.com/150",
  });

  const fetchUserData = async () => {
    try {
        const userData = await getCurrentUser();
        console.log('User data:', userData);
        // Example response:
        // {
        //   id: 1,
        //   email: "user@example.com",
        //   first_name: "John",
        //   last_name: "Doe",
        //   is_active: true,
        //   // ... other user fields
        // }
    } catch (error) {
        console.error('Error fetching user:', error);
        // Handle error (e.g., show notification, redirect to login)
    }
    };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white">
      <div className="flex flex-col items-center">
        <img
          className="w-32 h-32 rounded-full mb-4"
          src={user.profilePic}
          alt="Profile"
        />
        <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
