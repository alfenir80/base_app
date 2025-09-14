
import React from 'react';

type StatusMesa = 'disponivel' | 'ocupada';

interface MesaProps {
    mesa: {
      numero: number;
      status: StatusMesa;
    };
    onClick: () => void;
}

function Mesa({ mesa, onClick }: MesaProps) {
    const statusClass = mesa.status === 'disponivel'
        ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
        : 'bg-red-500 cursor-not-allowed';

    return (
        <div 
            className={`
                p-6 rounded-lg text-center font-bold text-white transition-colors duration-200
                ${statusClass}
            `} 
            onClick={onClick}
        >
            <p className='text-3xl mb-2'>Mesa {mesa.numero}</p>
            <span className='text-sm uppercase'>Status: {mesa.status}</span>
        </div>
    );
}

export default Mesa;