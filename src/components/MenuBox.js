// src/components/MenuBox.js
import React from 'react';

const MenuBox = () => {
    return (
        <div className="menu-container bg-white shadow-md p-4 rounded mr-6 mt-20">
            <ul className="space-y-2">
                <li className="menu-item text-orange-500 font-bold">Dashboard</li>
                <li className="menu-item hover:text-orange-500 pl-4">My Bike</li>
                <li className="menu-item hover:text-orange-500 pl-4">My Component</li>
                <li className="menu-item hover:text-orange-500 pl-4">Activities</li>
            </ul>
        </div>
    );
};

export default MenuBox;
