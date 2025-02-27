// src/components/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = ({ accessToken }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (accessToken) {
      axios
        .get("https://www.strava.com/api/v3/athlete", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setProfile(response.data);
          console.log("Profile fetched:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [accessToken]);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h2>@{profile.username}</h2>
      <img src={profile.profile} alt={profile.username} />
      <p>City: {profile.city}</p>
      <p>Country: {profile.country}</p>
      <p>Bio: {profile.bio}</p>
    </div>
  );
};

export default Profile;
