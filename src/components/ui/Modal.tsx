import React, { ReactNode } from 'react';

interface ModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  confirmLabel?: ReactNode; // Optional label or element for the confirm button
  closeLabel?: ReactNode; // Optional label or element for the close button
  onConfirm?: () => void; // Optional callback for confirm action
}

export const Modal: React.FC<ModalProps> = ({
  isVisible,
  title,
  message,
  onClose,
  confirmLabel = 'Confirm',
  closeLabel = 'Close',
  onConfirm,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-slate-950  rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="bg-blue-600 dark:bg-slate-600 hover:bg-blue-700 dark:hover:bg-slate-800 text-white px-4 py-2 rounded"
            >
              {confirmLabel}
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-400 text-white dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-500"
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
