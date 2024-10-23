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
      <div className="modal-box bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-screen my-8 overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute h-16 w-16 right-2 top-2">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default ModalComponent;
