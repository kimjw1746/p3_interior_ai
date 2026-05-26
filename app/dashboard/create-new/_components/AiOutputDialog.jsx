import React, { useEffect } from 'react'
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';

function AiOutputDialog({ openDialog, setOpenDialog, orgImage, aiImage }) {
  useEffect(() => {
    const modal = document.getElementById('my_modal_1');
    if (openDialog) {
      modal?.showModal();
    } else {
      modal?.close();
    }
  }, [openDialog]);

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box max-w-3xl flex flex-col items-center">
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Result:</h3>
        
        {aiImage && orgImage && (
          <div className="w-full flex justify-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
            <ReactBeforeSliderComponent
              firstImage={{ imageUrl: aiImage }}
              secondImage={{ imageUrl: orgImage }}
            />
          </div>
        )}
        
        <div className="modal-action w-full flex justify-end">
          <form method="dialog">
            <button className="btn btn-neutral" onClick={handleClose}>Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default AiOutputDialog
