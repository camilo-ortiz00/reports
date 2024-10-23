import React, { FC } from 'react';

const ModalDeleteComponent: FC<{
  show: boolean;
  title: string;
  children: any;
  closeModal: () => void;
  onConfirm: () => void;
}> = ({ show, title, children, closeModal, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-box bg-white rounded-lg shadow-lg max-w-md w-auto p-4">
        <div className="flex justify-between items-center border-b mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute h-16 w-16 right-2 top-2">✕</button>
        </div>
        <div>{children}</div>
        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-4">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteComponent;
