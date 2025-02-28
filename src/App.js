import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard'; // Dashboard 컴포넌트 import
import Header from './Header'; // Header 컴포넌트 import

const App = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('strava_access_token') || null);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    // 로그아웃 처리 함수
    const handleLogout = () => {
        localStorage.removeItem('strava_access_token');
        setAccessToken(null);
        window.location.href = '/';
    };

    // 액세스 토큰을 받아오는 함수
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
                navigate('/dashboard'); // 액세스 토큰을 받으면 대시보드로 이동
            } catch (error) {
                console.error('Error fetching access token:', error.response?.data || error.message);
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!accessToken && code) {
            fetchAccessToken(code);
        } else if (!accessToken) {
            const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID;
            const redirectUri = process.env.REACT_APP_STRAVA_REDIRECT_URI;
            const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=read,activity:read_all`;
            window.location.href = authUrl;
        }

    }, [accessToken, navigate]);

    // 프로필 정보 불러오기
    useEffect(() => {
        if (accessToken) {
            axios.get('https://www.strava.com/api/v3/athlete', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((response) => {
                setProfile(response.data);
            }).catch((error) => {
                console.error('Error fetching profile:', error.response?.data || error.message);
            });
        }
    }, [accessToken]);

    // 액세스 토큰이나 프로필이 없으면 로딩 화면 표시
    if (!accessToken || !profile) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {/* 헤더 컴포넌트 */}
            <Header profile={profile} handleLogout={handleLogout} />

            {/* 라우팅 설정 */}
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
