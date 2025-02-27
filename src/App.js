// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Profile from "./components/Profile";
import Activities from "./components/Activities";

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [authorizationCode, setAuthorizationCode] = useState(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("strava_access_token");
    console.log("Stored access token:", storedAccessToken);
    setAccessToken(storedAccessToken);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log("Authorization code from URL:", code);
    if (code) {
      setAuthorizationCode(code);
    }
  }, []);

  useEffect(() => {
    if (authorizationCode && !accessToken) {
      axios
        .post("https://www.strava.com/oauth/token", {
          client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
          client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
          code: authorizationCode,
          grant_type: "authorization_code",
        })
        .then((response) => {
          const newAccessToken = response.data.access_token;
          setAccessToken(newAccessToken);
          localStorage.setItem("strava_access_token", newAccessToken);
          console.log("New access token stored:", newAccessToken);
          window.history.replaceState({}, document.title, "/");
        })
        .catch((error) => {
          console.error("Error exchanging authorization code for access token:", error);
        });
    }
  }, [authorizationCode, accessToken]);

  return (
    <div>
      <h1>Strava Profile</h1>
      {accessToken ? (
        <>
          <Profile accessToken={accessToken} />
          <Activities accessToken={accessToken} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
