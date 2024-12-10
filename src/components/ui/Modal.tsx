import React from 'react';

interface ModalProps {
    isVisible: boolean;
    message: string;
    onClose: () => void;
    onConfirm?: () => void; // Optional callback for redirection
  }
  
  export const Modal: React.FC<ModalProps> = ({ isVisible, message, onClose, onConfirm }) => {
    if (!isVisible) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Success</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Sign In
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  