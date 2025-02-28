import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// 헤더 컴포넌트
const Header = ({ profile, handleLogout }) => {
    return (
        <div className="header flex justify-between items-center p-4 bg-gray-900 text-white fixed w-full top-0 z-50">
            <div className="logo text-3xl font-bold">OCD Rider</div>
            <div className="flex items-center">
                {profile && (
                    <div className="flex items-center">
                        <img src={profile.profile} alt="Profile" className="w-12 h-12 rounded-full mr-2" />
                        <span className="text-xl">@{profile.username}</span>
                    </div>
                )}
                <button className="ml-4 bg-red-500 hover:bg-red-600 px-3 py-1 rounded" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

// 대시보드 컴포넌트
const Dashboard = ({ profile }) => {
    return (
        <div className="flex pt-20">
            <div className="w-1/4 bg-gray-100 p-4 h-screen fixed top-16">
                <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
                <ul>
                    <li className="mb-2">My Bike</li>
                    <li className="mb-2">My Component</li>
                    <li className="mb-2">Activities</li>
                </ul>
            </div>
            <div className="w-2/4 p-4 ml-1/4 bg-white shadow rounded min-h-screen">
                <h2 className="text-2xl font-semibold mb-4">My Bike</h2>
                <div className="bike-image-container bg-gray-200 w-full h-64 flex items-center justify-center relative">
                    <span className="text-gray-500">Bike Image Placeholder</span>
                    <button className="edit-button absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                </div>
            </div>
            <div className="w-1/4 p-4 bg-gray-50 flex flex-col items-center justify-center min-h-screen">
                <button className="bg-green-500 text-white px-4 py-2 rounded">Add New Bike</button>
            </div>
        </div>
    );
};

// 메인 앱 컴포넌트
const App = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('strava_access_token') || null);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('strava_access_token');
        setAccessToken(null);
        window.location.href = '/';
    };

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
        } else if (!accessToken) {
            const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID;
            const redirectUri = process.env.REACT_APP_STRAVA_REDIRECT_URI;
            const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=read,activity:read_all`;
            window.location.href = authUrl;
        }

    }, [accessToken, navigate]);

    useEffect(() => {
        if (accessToken) {
            axios.get('https://www.strava.com/api/v3/athlete', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((response) => {
                setProfile(response.data);
            }).catch((error) => {
                console.error('Error fetching profile:', error);
            });
        }
    }, [accessToken]);

    if (!accessToken || !profile) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header profile={profile} handleLogout={handleLogout} />
            <Routes>
                <Route path="/dashboard" element={<Dashboard profile={profile} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </>
    );
};

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
