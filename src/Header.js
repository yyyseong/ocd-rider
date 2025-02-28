// src/Header.js
import React from 'react';

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

export default Header;
