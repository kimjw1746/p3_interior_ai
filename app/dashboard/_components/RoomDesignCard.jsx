import React from 'react'
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';

function RoomDesignCard({ room }) {
  return (
    <div className="shadow-lg rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-xl">
      <div className="overflow-hidden aspect-video">
        <ReactBeforeSliderComponent
          firstImage={{ imageUrl: room?.aiImage }}
          secondImage={{ imageUrl: room?.orgImage }}
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
          🏠 Room Type: <span className="font-normal text-gray-600 dark:text-gray-300">{room?.roomType}</span>
        </h2>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
          🎨 Design Type: <span className="font-normal text-gray-600 dark:text-gray-300">{room?.designType}</span>
        </p>
      </div>
    </div>
  )
}

export default RoomDesignCard
