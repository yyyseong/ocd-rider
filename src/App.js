// src/App.js
import React, { useState, useEffect } from "react";
import Profile from "./components/Profile";
import Activities from "./components/Activities";

const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID;
const clientSecret = process.env.REACT_APP_STRAVA_CLIENT_SECRET;
const redirectUri = process.env.REACT_APP_STRAVA_REDIRECT_URI;

const App = () => {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        // 🔥 기존 Access Token 초기화 (앱이 로드될 때마다 초기화)
        localStorage.removeItem("strava_access_token");

        const storedToken = localStorage.getItem("strava_access_token");
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get("code");

        console.log("Stored access token:", storedToken);
        console.log("Authorization code from URL:", authorizationCode);

        if (!storedToken && authorizationCode) {
            // 🔐 Strava Access Token 요청
            fetch("https://www.strava.com/oauth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: authorizationCode,
                    grant_type: "authorization_code",
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Access token fetched:", data.access_token);
                    setAccessToken(data.access_token);
                    localStorage.setItem("strava_access_token", data.access_token);
                    window.history.replaceState({}, document.title, "/"); // URL에서 인증 코드 제거
                })
                .catch((error) => {
                    console.error("Error fetching access token:", error);
                });
        } else if (storedToken) {
            setAccessToken(storedToken);
        }
    }, []);

    const handleLogin = () => {
        // 🌐 Strava OAuth 인증 강제 (approval_prompt=force)
        window.location = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=read,activity:read_all`;
    };

    return (
        <div>
            <h1>Strava Profile</h1>
            {!accessToken ? (
                <button onClick={handleLogin}>Connect with Strava</button>
            ) : (
                <>
                    <Profile accessToken={accessToken} />
                    <Activities accessToken={accessToken} />
                </>
            )}
        </div>
    );
};

export default App;
