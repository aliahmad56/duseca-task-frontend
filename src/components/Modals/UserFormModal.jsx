import React, { useState, useEffect } from 'react';
import './UserFormModal.css';

const UserFormModal = ({ show, onClose, onSave, userData }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');

    useEffect(() => {
        if (userData) {
            setName(userData.name);
            setEmail(userData.email);
            setRole(userData.role);
        } else {
            setName('');
            setEmail('');
            setRole('user');
        }
    }, [userData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ id: userData ? userData.id : Date.now(), name, email, role, password });
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{userData ? 'Edit User' : 'Create User'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="manager">Manager</option>
                            <option value="user">Regular User</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="save-button">Save</button>
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
