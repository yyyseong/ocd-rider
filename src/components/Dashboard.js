import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { db, storage } from '../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// 자전거 카드 컴포넌트
const BikeCard = ({ bike, handleDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(bike.name);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [bikeImage, setBikeImage] = useState(bike.image);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            updateBikeData();
        }
    };

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
