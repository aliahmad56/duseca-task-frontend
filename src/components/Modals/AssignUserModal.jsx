// src/Modals/AssignUserModal.js
import React, { useState, useEffect } from 'react';
import './AssignUserModal.css';

const AssignUserModal = ({ show, onClose, managers, users, onAssign }) => {
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    setSelectedManager('');
    setSelectedUsers([]);
  }, [show]);

  const handleUserSelection = userId => {
    setSelectedUsers(prevSelectedUsers => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter(id => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const handleAssign = () => {
    onAssign(selectedManager, selectedUsers);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Assign Users to Manager</h2>
        <div className="form-group">
          <label>Select Manager:</label>
          <select value={selectedManager} onChange={e => setSelectedManager(e.target.value)}>
            <option value="">Select a manager</option>
            {managers.map(manager => (
              <option key={manager._id} value={manager._id}>
                {manager.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Select Users to Assign:</label>
          {users.map(user => (
            <div key={user._id}>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserSelection(user._id)}
              />
              {user.name}
            </div>
          ))}
        </div>
        <button className="assign-button" onClick={handleAssign}>
          Assign
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AssignUserModal;
