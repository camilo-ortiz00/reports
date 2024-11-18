import React, { FC } from 'react';

interface CircularProgressProps {
  percentage: number;
}

const CircularProgress: FC<CircularProgressProps> = ({ percentage }) => {
  const radius = 40; // Radio del círculo
  const strokeWidth = 8; // Grosor del borde
  const circumference = 2 * Math.PI * radius; // Circunferencia del círculo
  const strokeDashoffset = circumference - (percentage / 100) * circumference; // Cálculo del offset de la barra

  return (
    <div className="relative group w-24 h-24 flex items-center justify-center">
      <svg className="transform rotate-90" width="100" height="100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={percentage >= 100 ? 'green' : '#3b82f6'}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />
      </svg>

      <div className="absolute font-semibold text-gray-700 text-lg">
        {`${percentage}%`}
      </div>

      <div className="absolute z-[-1] left-1/2 transform translate-x-[-50%] h-12 w-40 opacity-0 group-hover:opacity-100 group-hover:-translate-x-48 transition-all duration-500 bg-gray-200 text-black text-md px-3 py-1 rounded-lg shadow-lg flex items-center justify-center">
  Perfil completado
</div>



    </div>
  );
};

export default CircularProgress;
