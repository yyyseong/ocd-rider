import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Profile from './components/Profile';
import Activities from './components/Activities';
import './App.css';

const App = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('strava_access_token') || null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccessToken = async (code) => {
            try {
                const response = await axios.post('https://www.strava.com/oauth/token', {
                    client_id: process.env.REACT_APP_STRAVA_CLIENT_ID,
                    client_secret: process.env.REACT_APP_STRAVA_CLIENT_SECRET,
                    code: code,
                    grant_type: 'authorization_code',
                    redirect_uri: process.env.REACT_APP_STRAVA_REDIRECT_URI,
                });
                const { access_token } = response.data;
                localStorage.setItem('strava_access_token', access_token);
                setAccessToken(access_token);
                navigate('/dashboard');
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (!accessToken && code) {
            fetchAccessToken(code);
        } else if (accessToken) {
            navigate('/dashboard');
        }
    }, [accessToken, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('strava_access_token');
        setAccessToken(null);
        window.location.href = '/';
    };

    if (!accessToken) {
        const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID;
        const redirectUri = process.env.REACT_APP_STRAVA_REDIRECT_URI;
        const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=read,activity:read_all`;
        window.location.href = authUrl;
        return null;
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
