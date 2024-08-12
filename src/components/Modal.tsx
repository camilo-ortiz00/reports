import React, { FC } from 'react';

const ModalComponent: FC<{
  show: boolean;
  title: string;
  children: any;
  closeModal: () => void;
}> = ({ show, title, children, closeModal }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-box bg-base-100 dark:bg-base-200 rounded-lg shadow-lg w-full max-w-4xl h-screen">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <svg className="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>

        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default ModalComponent;
