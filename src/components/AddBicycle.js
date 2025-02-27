// src/components/AddBicycle.js
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddBicycle = () => {
  const [bicycleName, setBicycleName] = useState("");
  const [type, setType] = useState("Road");
  const [components, setComponents] = useState(["frame", "groupset", "wheels"]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bicycle"), {
        bicycleName,
        type,
        components,
        userId: "strava_user_id", // 실제 사용자 ID를 넣어주세요.
      });
      alert("자전거가 성공적으로 추가되었습니다!");
      setBicycleName("");
    } catch (error) {
      console.error("자전거 추가 중 오류:", error);
    }
  };

  return (
    <div>
      <h2>자전거 추가하기</h2>
      <form onSubmit={handleSubmit}>
        <label>
          자전거 이름:
          <input
            type="text"
            value={bicycleName}
            onChange={(e) => setBicycleName(e.target.value)}
            required
          />
        </label>
        <button type="submit">추가하기</button>
      </form>
    </div>
  );
};

export default AddBicycle;
