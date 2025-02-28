import React from 'react';
import BikeCard from './BikeCard';
import AddBikeButton from './AddBikeButton';

// 대시보드 컴포넌트
const Dashboard = ({ bikes }) => {
    return (
        <div className="flex flex-col items-start">
            <h2 className="text-gray-600 font-bold mb-4">Dashboard</h2>
            <div className="flex gap-6">
                {bikes.length > 0 && bikes.map((bike, index) => (
                    <BikeCard key={index} bike={bike} />
                ))}
                <AddBikeButton />
            </div>
        </div>
    );
};

export default Dashboard;
