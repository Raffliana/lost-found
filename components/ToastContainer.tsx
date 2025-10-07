
import React from 'react';
import { useToast, ToastMessage, ToastType } from '../context/ToastContext';

const toastConfig = {
    success: { bg: 'bg-green-500', icon: '✓' },
    error: { bg: 'bg-red-500', icon: '✗' },
    info: { bg: 'bg-blue-500', icon: 'ℹ' },
    warning: { bg: 'bg-yellow-500', icon: '⚠' },
};

const Toast: React.FC<{ message: ToastMessage, onDismiss: (id: number) => void }> = ({ message, onDismiss }) => {
    const config = toastConfig[message.type];

    return (
        <div className={`flex items-center text-white p-4 rounded-md shadow-lg ${config.bg} animate-fade-in-right`}>
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-lg font-bold">{config.icon}</div>
            <div className="ml-3 text-sm font-medium">{message.message}</div>
            <button onClick={() => onDismiss(message.id)} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-full inline-flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition">
                <span className="sr-only">Close</span>
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-5 right-5 z-50 w-full max-w-xs space-y-3">
            {toasts.map((toast) => (
                <Toast key={toast.id} message={toast} onDismiss={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;
