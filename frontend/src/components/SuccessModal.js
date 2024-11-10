import React from 'react';
import './SuccessModal.css';

const SuccessModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="success-modal">
        <div className="check-icon">✔️</div>
        <p>new task has been created successfully</p>
        <button onClick={onClose} className="back-button">Back</button>
      </div>
    </div>
  );
};

export default SuccessModal;
