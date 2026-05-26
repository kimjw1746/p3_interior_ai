"use client"
import React, { useState } from 'react'

// props(프롭스)로 selectedFile 함수를 받습니다.
function ImageSelection({ selectedFile }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const onFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      // 선택된 file 객체를 부모 컴포넌트로 전달합니다.
      selectedFile(file); 
    }
  }

  return (
    <div>
      <label>Select Image of your room</label>
      <div className='mt-3'>
        <input type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full max-w-xs"
          onChange={onFileSelected}
        />
      </div>
      
      {selectedImage && (
        <div style={{ marginTop: '20px', maxWidth: '500px', width: '100%' }}>
          <img
            src={selectedImage}
            alt="Selected room"
            style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      )}
    </div>
  )
}

export default ImageSelection
