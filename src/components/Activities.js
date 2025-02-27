// src/components/Activities.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Activities = ({ accessToken }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (accessToken) {
      axios
        .get("https://www.strava.com/api/v3/athlete/activities", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setActivities(response.data);
          console.log("Activities fetched:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching activities:", error);
        });
    }
  }, [accessToken]);

  return (
    <div>
      <h2>Strava Activities</h2>
      {activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <strong>{activity.name}</strong> - {activity.distance / 1000} km
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities found.</p>
      )}
    </div>
  );
};

export default Activities;
