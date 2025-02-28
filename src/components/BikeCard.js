import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

// 자전거 카드 컴포넌트
const BikeCard = ({ bike, handleDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(bike.name);
    const [bikeImage, setBikeImage] = useState(bike.image);

    // ✨ 편집 모드 전환 및 데이터 업데이트
    const handleEditClick = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            updateBikeData();
        }
    };

    // 🔄 Firebase 데이터 업데이트 함수
    const updateBikeData = async () => {
        try {
            const bikeRef = doc(db, 'bikes', bike.id);
            await updateDoc(bikeRef, { name: editedName, image: bikeImage });
            console.log('Bike data updated!');
        } catch (error) {
            console.error('Error updating bike data:', error);
        }
    };

    return (
        <div className="flex flex-col items-center mt-8">
            <div className="card aspect-[5/4] relative rounded-2xl bg-gray-200">
                <img src={bikeImage} alt="Bike" className="w-full h-full object-cover rounded-2xl" />
                {/* 🟠 편집 버튼 */}
                <button className="edit-button bg-orange-500 text-white" onClick={handleEditClick}>
                    {isEditing ? 'Done' : 'Edit'}
                </button>
            </div>
            <div className="bike-name-box bg-orange-500 text-white font-bold w-full text-center py-2 mt-2 rounded-2xl">
                <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-transparent text-center text-white font-bold"
                />
            </div>
        </div>
    );
};

export default BikeCard;
