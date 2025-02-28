// src/Dashboard.js

import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const Dashboard = ({ profile }) => {
    const [bikeName, setBikeName] = useState('');
    const [showAddBike, setShowAddBike] = useState(false);
    const [image, setImage] = useState(null);
    const [cropData, setCropData] = useState('');

    const cropperRef = useRef(null);  // useRef로 cropper 인스턴스를 저장

    const handleAddBikeClick = () => {
        setShowAddBike(true);
    };

    const handleBikeNameChange = (e) => {
        setBikeName(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleCropImage = () => {
        if (cropperRef.current) {
            setCropData(cropperRef.current.getCroppedCanvas().toDataURL());
        }
    };

    const handleSaveBike = () => {
        console.log('Saving bike:', bikeName, cropData);
        setShowAddBike(false); // Save 후 입력 폼 숨기기
    };

    return (
        <div className="p-4 flex flex-col bg-gray-100 min-h-screen pt-20">
            {/* Dashboard 내용 */}
            {/* 생략 */}
        </div>
    );
};

export default Dashboard;
