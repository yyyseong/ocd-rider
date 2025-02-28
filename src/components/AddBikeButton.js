import React from 'react';

// 자전거 추가 버튼 컴포넌트
const AddBikeButton = () => {
    return (
        <div className="add-new-bike bg-orange-500 flex items-center justify-center cursor-pointer">
            <span className="text-white text-6xl font-bold">+</span>
        </div>
    );
};

export default AddBikeButton;
