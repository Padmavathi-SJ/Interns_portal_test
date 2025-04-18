import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ email: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/profile", {
          withCredentials: true,
        });
        if (res.data.status) {
          setProfile({ email: res.data.email });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => navigate("/AdminLogin");

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setDropdownOpen(!dropdownOpen)}>
        <HiUserCircle className="text-gray-800 text-4xl" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-md z-50">
          <div className="p-4 border-b border-gray-200 text-sm">
            <p className="font-semibold  text-black truncate">{profile.email}</p>
          </div>
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-600 px-4 py-2 hover:bg-gray-100 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
