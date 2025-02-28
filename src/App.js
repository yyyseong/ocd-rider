import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

// 헤더 컴포넌트
const Header = ({ profile, handleLogout }) => {
    return (
        <div className="header fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-white border-b border-gray-200 z-10">
            <div className="logo text-2xl font-bold">OCD Rider</div>
            <div className="flex items-center">
                {profile && (
                    <div className="flex items-center">
                        <img src={profile.profile} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
                        <span className="text-lg">@{profile.username}</span>
                    </div>
                )}
                <button className="ml-4 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

// 대시보드 컴포넌트
const Dashboard = ({ profile }) => {
    const [bikeName, setBikeName] = useState('');
    const [showAddBike, setShowAddBike] = useState(false);
    const [image, setImage] = useState(null);
    const [cropData, setCropData] = useState('');

    const handleAddBikeClick = () => {
        setShowAddBike(true);
    };

    const handleBikeNameChange = (e) => {
        setBikeName(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleCropImage = () => {
        if (cropper) {
            setCropData(cropper.getCroppedCanvas().toDataURL());
        }
    };

    const handleSaveBike = () => {
        // Save the bike details, name, and image
        console.log('Saving bike:', bikeName, cropData);
        setShowAddBike(false); // Hide the input form after saving
    };

    return (
        <div className="p-4 flex flex-col bg-gray-100 min-h-screen pt-20">
            <div className="flex">
                <div className="menu-container bg-white shadow-md p-4 rounded mr-6 mt-20">
                    <ul className="space-y-2">
                        <li className="menu-item text-orange-500 font-bold">Dashboard</li>
                        <li className="menu-item hover:text-orange-500 pl-4">My Bike</li>
                        <li className="menu-item hover:text-orange-500 pl-4">My Component</li>
                        <li className="menu-item hover:text-orange-500 pl-4">Activities</li>
                    </ul>
                </div>
                <div className="flex flex-col items-start mt-20">
                    <h2 className="text-gray-500 font-bold text-3xl mb-4">Dashboard</h2>
                    <div className="flex gap-6">
                        {showAddBike ? (
                            <div className="flex flex-col items-center bg-white p-4 shadow-md rounded">
                                <input 
                                    type="text" 
                                    value={bikeName} 
                                    onChange={handleBikeNameChange} 
                                    placeholder="Enter Bike Name"
                                    className="p-2 mb-4 border rounded"
                                />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    className="mb-4"
                                />
                                {image && (
                                    <Cropper
                                        src={image}
                                        style={{ height: 400, width: '100%' }}
                                        initialAspectRatio={5 / 4}
                                        aspectRatio={5 / 4}
                                        guides={false}
                                        onInitialized={(instance) => { cropper = instance; }}
                                    />
                                )}
                                <button className="bg-orange-500 text-white px-4 py-2 mt-4" onClick={handleCropImage}>Crop Image</button>
                                <button className="bg-green-500 text-white px-4 py-2 mt-4" onClick={handleSaveBike}>Save Bike</button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="card aspect-[5/4] relative">
                                    <button className="edit-button">Edit</button>
                                </div>
                                <div className="bike-name-box bg-orange-500 text-white font-bold w-full text-center py-2 mt-2">
                                    Bike Name
                                </div>
                            </div>
                        )}
                        <div 
                            className="add-new-bike bg-orange-500 text-white text-6xl font-bold cursor-pointer"
                            onClick={handleAddBikeClick}
                        >
                            +
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
