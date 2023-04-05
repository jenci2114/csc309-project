import React from 'react';

const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div>
      <h2>Are you sure you want to delete this item?</h2>
      <button onClick={onConfirm}>Yes, delete</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default DeleteConfirmation;