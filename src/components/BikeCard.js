import React from 'react';

// 등록된 자전거 카드 컴포넌트
const BikeCard = ({ bike }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="card aspect-[5/4] relative bg-gray-300">
                <button className="edit-button">Edit</button>
            </div>
            <div className="bike-name-box bg-orange-500 text-white font-bold w-full text-center py-2 mt-2">
                {bike.name}
            </div>
        </div>
    );
};

export default BikeCard;
