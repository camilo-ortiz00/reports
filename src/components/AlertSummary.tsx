import React from 'react';

interface SummaryAlertProps {
  showAlert: boolean;
  alertMessage: string;
  onClose: () => void;
}

const SummaryAlert: React.FC<SummaryAlertProps> = ({ showAlert, alertMessage, onClose }) => {
  if (!showAlert) return null; // Si no se debe mostrar la alerta, no renderiza nada.

  return (
    <div role="alert" className="alert shadow-lg mt-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-info h-6 w-6 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div>
        <h3 className="font-bold">Resumen</h3>
        <div className="text-xs">{alertMessage}</div>
      </div>
      <button className="btn btn-sm" onClick={onClose}>
        Ok!
      </button>
    </div>
  );
};

export default SummaryAlert;
