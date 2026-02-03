import React from 'react';
import { X } from 'lucide-react';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 w-96 border border-purple-700 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Confirm Logout</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-300 mb-6">
          Are you sure you want to logout from CineVerse?
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;