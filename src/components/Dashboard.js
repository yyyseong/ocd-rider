import React from 'react';
import BikeCard from './BikeCard';
import AddBikeButton from './AddBikeButton';

// Dashboard 컴포넌트
const Dashboard = ({ bikes, handleAddBike, handleDeleteBike }) => {
    return (
        <div className="p-4 flex flex-col bg-gray-100 min-h-screen pt-20">
            <div className="flex">
                <div className="flex flex-col items-start w-full">
                    <h2 className="text-gray-600 font-bold mb-4 mt-10">Dashboard</h2>
                    <div className="flex gap-6 mt-6">
                        {/* 자전거 카드 목록 렌더링 */}
                        {bikes.length > 0 ? (
                            bikes.map((bike) => (
                                <BikeCard
                                    key={bike.id}
                                    bike={bike}
                                    handleDelete={handleDeleteBike}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">등록된 자전거가 없습니다. 자전거를 추가해주세요!</p>
                        )}

                        {/* 자전거 추가 버튼 */}
                        <AddBikeButton onAdd={handleAddBike} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
