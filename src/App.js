import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// 헤더 컴포넌트
const Header = ({ profile, handleLogout }) => {
    return (
        <div className="header flex justify-between items-center p-4 bg-gray-900 text-white">
            <div className="logo text-2xl font-bold">OCD Rider</div>
            <div className="flex items-center">
                {profile && (
                    <div className="flex items-center">
                        <img src={profile.profile} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
                        <span className="text-lg">@{profile.username}</span>
                    </div>
                )}
                <button className="ml-4 bg-red-500 hover:bg-red-600 px-3 py-1 rounded" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

// 대시보드 컴포넌트
const Dashboard = ({ profile, activities }) => {
    return (
        <div className="dashboard p-4">
            <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
            <ul className="activities-list">
                {activities.map((activity) => (
                    <li key={activity.id} className="activity-item">
                        <strong>{activity.name}</strong> - {(activity.distance / 1000).toFixed(2)} km
                    </li>
                ))}
            </ul>
        </div>
    );
};

// 메인 앱 컴포넌트
const App = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('strava_access_token') || null);
    const [profile, setProfile] = useState(null);
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    // 로그아웃 처리
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

            axios.get('https://www.strava.com/api/v3/athlete/activities', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((response) => {
                setActivities(response.data);
            }).catch((error) => {
                console.error('Error fetching activities:', error);
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
                <Route path="/dashboard" element={<Dashboard profile={profile} activities={activities} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </>
    );
};

// React Router 적용
const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
