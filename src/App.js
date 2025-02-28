import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Profile from './components/Profile';
import Activities from './components/Activities';
import './App.css';

const App = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('strava_access_token') || null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!accessToken && code) {
            console.log("Authorization code received:", code);
            const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID;
            const clientSecret = process.env.REACT_APP_STRAVA_CLIENT_SECRET;
            const redirectUri = process.env.REACT_APP_STRAVA_REDIRECT_URI;

            axios.post('https://www.strava.com/oauth/token', {
                client_id: clientId,
                client_secret: clientSecret,
                code,
                grant_type: 'authorization_code',
            })
                .then((response) => {
                    console.log("Access token received:", response.data.access_token);
                    const token = response.data.access_token;
                    setAccessToken(token);
                    localStorage.setItem('strava_access_token', token);
                    window.history.replaceState({}, document.title, "/"); // URL에서 코드 제거
                })
                .catch((error) => {
                    console.error('Error exchanging authorization code:', error);
                });
        } else if (!accessToken) {
            const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID;
            const redirectUri = process.env.REACT_APP_STRAVA_REDIRECT_URI;
            const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=read,activity:read_all`;
            window.location.href = authUrl;
        }
    }, [accessToken]);

    const handleLogout = () => {
        localStorage.removeItem('strava_access_token');
        setAccessToken(null);
        window.location.href = '/';
    };

    if (!accessToken) {
        return <p>Loading...</p>;
    }

    return (
        <div className="app-container">
            <Profile accessToken={accessToken} />
            <Activities accessToken={accessToken} />
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default App;
