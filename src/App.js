import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const Profile = ({ accessToken }) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (accessToken) {
            axios.get('https://www.strava.com/api/v3/athlete', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    setProfile(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching profile:', error);
                });
        }
    }, [accessToken]);

    if (!profile) {
        return <p>Loading...</p>;
    }

    return (
        <div className="profile">
            <img src={profile.profile} alt="Profile" className="profile-img" />
            <h2 className="profile-username">@{profile.username}</h2>
        </div>
    );
};

const Activities = ({ accessToken }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        if (accessToken) {
            axios.get('https://www.strava.com/api/v3/athlete/activities', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    setActivities(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching activities:', error);
                });
        }
    }, [accessToken]);

    return (
        <div className="activities">
            <h2 className="activities-title">Recent Activities</h2>
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

const BicycleManager = ({ stravaUserId }) => {
    const [bicycleName, setBicycleName] = useState('');
    const [bicycles, setBicycles] = useState([]);

    useEffect(() => {
        const fetchBicycles = async () => {
            const querySnapshot = await getDocs(collection(db, 'bicycle'));
            const fetchedBicycles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBicycles(fetchedBicycles);
        };
        fetchBicycles();
    }, []);

    const handleAddBicycle = async () => {
        try {
            await addDoc(collection(db, 'bicycle'), {
                bicycleName,
                userId: stravaUserId,
            });
            setBicycleName('');
            alert('Bicycle added successfully!');
        } catch (error) {
            console.error('Error adding bicycle:', error);
        }
    };

    return (
        <div className="bicycle-manager">
            <h2>Add a Bicycle</h2>
            <input
                type="text"
                placeholder="Bicycle Name"
                value={bicycleName}
                onChange={(e) => setBicycleName(e.target.value)}
            />
            <button onClick={handleAddBicycle}>Add Bicycle</button>

            <h3>Your Bicycles</h3>
            <ul>
                {bicycles.map((bike) => (
                    <li key={bike.id}>{bike.bicycleName}</li>
                ))}
            </ul>
        </div>
    );
};

const App = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('strava_access_token') || null);

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
            <BicycleManager stravaUserId="strava_user_id" />
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default App;
