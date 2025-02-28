import React, { useState } from 'react';

// 자전거 카드 컴포넌트
const BikeCard = ({ bike, handleDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(bike.name);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [bikeImage, setBikeImage] = useState(null);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        handleDelete(bike.id);
        setShowDeleteConfirm(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBikeImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="card aspect-[5/4] relative rounded-2xl bg-gray-200">
                {bikeImage ? (
                    <img src={bikeImage} alt="Bike" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                    <span className="text-gray-500">No Image</span>
                )}
                <button className="edit-button bg-orange-500 text-white" onClick={handleEditClick}>Edit</button>
                {isEditing && (
                    <button className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded" onClick={handleDeleteClick}>X</button>
                )}
                {showDeleteConfirm && (
                    <div className="absolute bg-white border p-4 rounded shadow-lg">
                        <p>Are you sure you want to delete this bike?</p>
                        <button className="bg-red-500 text-white px-3 py-1 rounded mr-2" onClick={confirmDelete}>Yes</button>
                        <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setShowDeleteConfirm(false)}>No</button>
                    </div>
                )}
                {isEditing && (
                    <div className="absolute bottom-2 left-2 flex gap-2">
                        <input 
                            type="text" 
                            value={editedName} 
                            onChange={(e) => setEditedName(e.target.value)} 
                            className="p-1 border rounded"
                        />
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                )}
            </div>
            <div className="bike-name-box bg-orange-500 text-white font-bold w-full text-center py-2 mt-2 rounded-2xl">
                {editedName}
            </div>
        </div>
    );
};

export default BikeCard;
