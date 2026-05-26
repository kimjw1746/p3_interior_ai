"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '../../../config/db';
import { desc, eq } from 'drizzle-orm';
import { AiGeneratedImage } from '../../../config/schema';
import RoomDesignCard from './RoomDesignCard';
import Link from 'next/link';
import AiOutputDialog from '../create-new/_components/AiOutputDialog'

function Listing() {
  const { user } = useUser();
  const [userRoomList, setUserRoomList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState();

  useEffect(() => {
    user && GetUserRoomList();
  }, [user]);

  const GetUserRoomList = async () => {
    const result = await db.select().from(AiGeneratedImage)
      .where(eq(AiGeneratedImage.userEmail, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(AiGeneratedImage.id));
    setUserRoomList(result);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center text-2xl font-extrabold text-gray-800 dark:text-gray-100">
        <span>Hello, {user?.fullName} 👋</span>
        <Link href={'/dashboard/create-new'}>
          <button className="btn btn-primary shadow-md hover:scale-[1.02] transition-transform duration-200">
            + Generate AI Interior
          </button>
        </Link>
      </div>

      {userRoomList?.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[350px] border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-2xl p-8 text-center text-gray-500 mt-8">
          <span className="text-5xl mb-4">🏠</span>
          <p className="text-xl font-semibold mb-2">No Interior AI Designs Generated Yet</p>
          <p className="text-sm text-gray-400">Click the button above to start redesigning your rooms!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {userRoomList.map((room, index) => (
            <div 
              key={index} 
              onClick={() => { setOpenDialog(true); setSelectedRoom(room); }}
              className="w-full cursor-pointer hover:scale-[1.01] transition-transform duration-200"
            >
              <RoomDesignCard room={room} />
            </div>
          ))}
        </div>
      )}
      <AiOutputDialog 
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        aiImage={selectedRoom?.aiImage}
        orgImage={selectedRoom?.orgImage}
      />
    </div>
  )
}

export default Listing