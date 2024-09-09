import React, { FC, useEffect } from 'react';

interface AlertComponentProps {
  show: boolean;
  type: 'error' | 'success' | 'info' | 'warning';
  message: string;
  onClose: (show: boolean) => void;
}

const AlertComponent: FC<AlertComponentProps> = ({ show, type, message, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose(false);
      }, 5000); // Se cierra automáticamente después de 5 segundos

      return () => clearTimeout(timer); // Limpia el temporizador al desmontar
    }
  }, [show, onClose]);

  if (!show) return null;



  const typeClasses = {
    error: 'bg-red-600 text-white',
    success: 'bg-green-400 text-white',
    info: 'bg-blue-600 text-white',
    warning: 'bg-yellow-300 text-black',
  };

  const alertClass = typeClasses[type];

  return (
    <div
      className={`fixed bottom-4 right-4 w-1/2 ${alertClass} shadow-lg rounded-lg p-4 flex items-center justify-between`}
      role="alert"
    >
      <div className="flex items-center">
        <span>{message}</span>
      </div>
      <button
        type="button"
        className="btn btn-sm btn-circle btn-ghost"
        onClick={() => onClose(false)}
      >
        ✕
      </button>
    </div>
  );
};

export default AlertComponent;
