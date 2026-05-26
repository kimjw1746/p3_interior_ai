import React from 'react'

function CustomLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8">
      <span className="loading loading-spinner loading-lg text-primary animate-pulse"></span>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
        Redesigning your room... do not refresh
      </h2>
    </div>
  )
}

export default CustomLoading
