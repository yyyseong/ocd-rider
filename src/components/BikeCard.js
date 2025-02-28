import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

// 자전거 카드 컴포넌트
const BikeCard = ({ bike, handleDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(bike.name);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [bikeImage, setBikeImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

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
            setIsCropping(true);
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = async () => {
        try {
            const croppedImage = await getCroppedImg(bikeImage, croppedAreaPixels);
            setBikeImage(croppedImage);
            setIsCropping(false);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="card aspect-[5/4] relative rounded-2xl bg-gray-200">
                {bikeImage && isCropping ? (
                    <Cropper
                        image={bikeImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={5 / 4}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                ) : bikeImage ? (
                    <img src={bikeImage} alt="Bike" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                    <span className="text-gray-500">No Image</span>
                )}
                <button className="edit-button bg-orange-500 text-white" onClick={handleEditClick}>{isEditing ? 'Done' : 'Edit'}</button>
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
                        <button className="bg-green-500 text-white p-1 rounded" onClick={() => document.getElementById(`fileInput-${bike.id}`).click()}>+</button>
                        <input id={`fileInput-${bike.id}`} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        <button className="bg-red-500 text-white p-1 rounded" onClick={() => setBikeImage(null)}>-</button>
                        {isCropping && (
                            <button className="bg-blue-500 text-white p-1 rounded" onClick={handleCropSave}>Crop & Save</button>
                        )}
                    </div>
                )}
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
