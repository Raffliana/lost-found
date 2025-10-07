
import React from 'react';

const UnsriLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            <circle cx="50" cy="50" r="48" stroke="#003366" strokeWidth="4" />
            <g transform="translate(50,50)">
                {[0, 72, 144, 216, 288].map(angle => (
                    <g key={angle} transform={`rotate(${angle})`}>
                        <path
                            d="M 0,-40 C 15,-20 15,20 0,40 C -15,20 -15,-20 0,-40 Z"
                            fill="#FFD700"
                        />
                    </g>
                ))}
            </g>
            <circle cx="50" cy="50" r="10" fill="#003366" />
        </svg>
    );
};

export default UnsriLogo;
