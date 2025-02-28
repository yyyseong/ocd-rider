import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';

// 컴포넌트 불러오기
import Header from './components/Header';
import MenuBox from './components/MenuBox';
import Dashboard from './components/Dashboard';

const App = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('strava_access_token') || null);
    const [profile, setProfile] = useState(null);
    const [registeredBikes, setRegisteredBikes] = useState([]); // 등록된 자전거 목록 상태 관리
    const navigate = useNavigate();

    // 로그아웃 기능
    const handleLogout = () => {
        localStorage.removeItem('strava_access_token');
        setAccessToken(null);
        window.location.href = '/';
    };

    // Strava 인증 토큰 가져오기
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
                console.log('Access Token:', access_token);
                localStorage.setItem('strava_access_token', access_token);
                setAccessToken(access_token);
                navigate('/dashboard');
            } catch (error) {
                console.error('Error fetching access token:', error.response?.data || error.message);
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log('Authorization Code:', code);

        if (!accessToken && code) {
            fetchAccessToken(code);
        } else if (!accessToken) {
            const clientId = process.env.REACT_APP_STRAVA_CLIENT_ID;
            const redirectUri = process.env.REACT_APP_STRAVA_REDIRECT_URI;
            const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=read,activity:read_all`;
            console.log('Auth URL:', authUrl);
            window.location.href = authUrl;
        }
    }, [accessToken, navigate]);

    // 사용자 프로필 및 등록된 자전거 데이터 가져오기
    useEffect(() => {
        if (accessToken) {
            axios.get('https://www.strava.com/api/v3/athlete', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((response) => {
                setProfile(response.data);
                // 예시: 등록된 자전거 데이터 세팅
                setRegisteredBikes([
                    { name: 'Bike 1' },
                    { name: 'Bike 2' }
                ]);
            }).catch((error) => {
                console.error('Error fetching profile:', error.response?.data || error.message);
            });
        }
    }, [accessToken]);

    if (!accessToken || !profile) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header profile={profile} handleLogout={handleLogout} />
            <div className="flex">
                <MenuBox />
                <Dashboard bikes={registeredBikes} />
            </div>
        </>
    );
};

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
