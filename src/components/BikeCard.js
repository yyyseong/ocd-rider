import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { db, storage } from '../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// 자전거 카드 컴포넌트 정의
const BikeCard = ({ bike, handleDelete }) => {
    // 상태 관리
    const [isEditing, setIsEditing] = useState(false); // 편집 모드 활성화 여부
    const [editedName, setEditedName] = useState(bike.name); // 자전거 이름 편집 상태
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 삭제 확인 모달
    const [bikeImage, setBikeImage] = useState(bike.image); // 자전거 이미지 URL
    const [crop, setCrop] = useState({ x: 0, y: 0 }); // 이미지 크롭 위치
    const [zoom, setZoom] = useState(1); // 이미지 확대 비율
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // 크롭 영역
    const [isCropping, setIsCropping] = useState(false); // 크롭 모드 활성화 여부

    // 🟠 편집 버튼 클릭 시 동작
    const handleEditClick = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            updateBikeData(); // 편집 모드에서 빠져나올 때 데이터 저장
        }
    };

    // 🔄 Firebase에 자전거 데이터 업데이트
    const updateBikeData = async () => {
        try {
            const bikeRef = doc(db, 'bikes', bike.id);
            await updateDoc(bikeRef, { name: editedName, image: bikeImage });
            console.log('Bike data updated!');
        } catch (error) {
            console.error('Error updating bike data:', error);
        }
    };

    // ❌ 삭제 버튼 클릭 시 확인 모달 표시
    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    // ✅ 삭제 확인 시 Firebase에서 자전거 및 이미지 삭제
    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(db, 'bikes', bike.id));
            if (bike.image) {
                const imageRef = ref(storage, bike.image);
                await deleteObject(imageRef);
            }
            handleDelete(bike.id); // 부모 컴포넌트에 삭제 알림
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Error deleting bike:', error);
        }
    };

    // 📂 이미지 파일 선택 시
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBikeImage(URL.createObjectURL(file)); // 미리보기 이미지 설정
            setIsCropping(true); // 크롭 모드 활성화
        }
    };

    // ✂️ 크롭 완료 시 크롭 영역 저장
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    // 💾 크롭 이미지 저장 및 Firebase 업로드
    const handleCropSave = async () => {
        try {
            const croppedImage = await getCroppedImg(bikeImage, croppedAreaPixels);
            const imageRef = ref(storage, `bikes/${bike.id}`);
            await uploadBytes(imageRef, croppedImage);
            const downloadURL = await getDownloadURL(imageRef);
            setBikeImage(downloadURL);
            setIsCropping(false);
            updateBikeData(); // Firebase에 URL 업데이트
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* 자전거 이미지 카드 */}
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

                {/* Edit / Done 버튼 */}
                <button className="edit-button bg-orange-500 text-white" onClick={handleEditClick}>
                    {isEditing ? 'Done' : 'Edit'}
                </button>

                {/* 이미지 삭제 버튼 */}
                {isEditing && (
                    <button className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded" onClick={handleDeleteClick}>X</button>
                )}

                {/* 삭제 확인 모달 */}
                {showDeleteConfirm && (
                    <div className="absolute bg-white border p-4 rounded shadow-lg">
                        <p>Are you sure you want to delete this bike?</p>
                        <button className="bg-red-500 text-white px-3 py-1 rounded mr-2" onClick={confirmDelete}>Yes</button>
                        <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setShowDeleteConfirm(false)}>No</button>
                    </div>
                )}

                {/* 이미지 추가/삭제 버튼 */}
                {isEditing && (
                    <div className="absolute top-2 right-2 flex gap-1">
                        <button className="bg-green-500 text-white w-8 h-8 rounded" onClick={() => document.getElementById(`fileInput-${bike.id}`).click()}>+</button>
                        <input id={`fileInput-${bike.id}`} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        <button className="bg-red-500 text-white w-8 h-8 rounded" onClick={() => setBikeImage(null)}>-</button>
                        {isCropping && (
                            <button className="bg-blue-500 text-white p-1 rounded" onClick={handleCropSave}>Crop & Save</button>
                        )}
                    </div>
                )}
            </div>

            {/* 자전거 이름 텍스트 박스 */}
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
