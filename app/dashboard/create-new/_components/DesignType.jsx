"use client"
import React, { useState } from 'react'

function DesignType({ selectedDesignType }) {
  // 요청하신 순서와 파일명에 맞춰 리스트를 재구성했습니다.
  const designs = [
    { name: 'Americana', image: '/americana.jpg' },
    { name: 'Farmhouse', image: '/farmhouse.jpg' },
    { name: 'Bohemian', image: '/bohemian.jpg' },
    { name: 'Maximalist', image: '/maximalist.jpg' },
    { name: 'Neo-Industrial', image: '/neo-industrial.jpg' },
    { name: 'Scandinavian', image: '/scandinavian.jpg' },
    { name: 'Minimalist', image: '/minimalist.jpg' }
  ]

  const [selectedOption, setSelectedOption] = useState();

  return (
    <div className='mt-5'>
      <label className='text-gray-500'>Select Interior Design Type</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
        {designs.map((design, index) => (
          <div 
            key={index} 
            onClick={() => {
              setSelectedOption(design.name);
              selectedDesignType(design.name);
            }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className={`aspect-square w-full relative overflow-hidden rounded-lg ${selectedOption === design.name ? 'ring-4 ring-blue-500' : ''}`}>
              <img 
                src={design.image} 
                className="absolute inset-0 w-full h-full object-cover rounded-lg" 
                alt={design.name} 
              />
            </div>
            <h2 className="text-center mt-2 font-medium">
              {design.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DesignType
