"use client"
import React, { useState, useContext } from 'react'
import CustomLoading from './_components/CustomLoading'
import AiOutputDialog from './_components/AiOutputDialog'
import ImageSelection from './_components/ImageSelection'
import RoomType from './_components/RoomType'
import DesignType from './_components/DesignType'
import AdditionalReq from './_components/AdditionalReq'
import axios from 'axios'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../../config/firebaseConfig'
import { useUser } from '@clerk/nextjs'
import { db } from '../../../config/db'
import { Users } from '../../../config/schema'
import { UserDetailContext } from '../../_context/UserDetailContext'
import { eq } from 'drizzle-orm'

function CreateNew() {
  const { user } = useUser();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiOutputImage, setAiOutputImage] = useState();
  const [orgImage, setOrgImage] = useState();
  const [openOutputDialog, setOpenOutputDialog] = useState(false);
  const [error, setError] = useState('');
  
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const onHandleInputChange = (value, fieldName) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: value
    }));
    console.log(formData); 
  }

  const saveRawImageToFirebase = async () => {
    const fileName = Date.now() + "_raw.png";
    const imageRef = ref(storage, 'interior-ai/' + fileName);

    await uploadBytes(imageRef, formData.image).then(resp => {
      console.log('File Uploaded...');
    });

    const downloadUrl = await getDownloadURL(imageRef);
    console.log(downloadUrl);
    return downloadUrl;
  }

  const updateUserCredits = async () => {
    const result = await db.update(Users).set({
      credits: userDetail?.credits - 1
    })
    .where(eq(Users.email, userDetail?.email))
    .returning({ id: Users.id });

    if (result) {
      setUserDetail(prev => ({
        ...prev,
        credits: userDetail?.credits - 1
      }))
      return result[0].id
    }
  }

  const generateAIImage = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData?.image) {
        throw new Error('이미지를 먼저 선택해주세요.');
      }

      const rawImageUrl = await saveRawImageToFirebase();
      setOrgImage(rawImageUrl);
      const result = await axios.post('/api/interior-ai', {
          imageUrl: rawImageUrl,
          roomType: formData?.roomType,
          designType: formData?.designType,
          additionalReq: formData?.additionalReq,
          userEmail: user?.primaryEmailAddress?.emailAddress
      });
      console.log("result", result);
      setAiOutputImage(result.data.result);
      
      await updateUserCredits();

      setOpenOutputDialog(true);
    } catch (err) {
      console.error("Frontend Generate Error: ", err);
      setError(
        err?.response?.data?.error ||
        err?.message ||
        '이미지 생성 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 style={{ color: 'purple', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>
        Create AI Interior
      </h2>
      <p style={{ textAlign: 'center', color: 'gray', marginBottom: '1rem' }}>
        학번: 2021810019 | 이름: 김주완
      </p>

      {loading ? (
        <CustomLoading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div>
            {/* 이미지 선택 컴포넌트 */}
            <ImageSelection 
              selectedFile={(value) => onHandleInputChange(value, 'image')} 
            />
          </div>
          <div>
            {/* 방 종류 선택: 'roomType' 키 사용 */}
            <RoomType 
              selectedRoomType={(value) => onHandleInputChange(value, 'roomType')} 
            />
            {/* 디자인 선택: 'designType' 키 사용 */}
            <DesignType 
              selectedDesignType={(value) => onHandleInputChange(value, 'designType')} 
            />
            {/* 추가 요청: 'additionalReq' 키 사용 */}
            <AdditionalReq 
              additionalReqInput={(value) => onHandleInputChange(value, 'additionalReq')}
            />
            
            <button 
              onClick={generateAIImage} 
              disabled={loading} 
              className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Generating AI Interior...
                </>
              ) : (
                "Generate"
              )}
            </button>
            <p className="text-gray-500 text-center text-sm mt-2">
              Each generation costs one credit
            </p>
            {error && (
              <p className="text-red-500 text-center text-sm mt-3">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
      <AiOutputDialog 
        openDialog={openOutputDialog} 
        setOpenDialog={setOpenOutputDialog}
        orgImage={orgImage}
        aiImage={aiOutputImage}
      />
    </div>
  )
}

export default CreateNew
