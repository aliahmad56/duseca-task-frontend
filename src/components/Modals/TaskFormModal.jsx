import React, { useState, useEffect } from 'react';
import './TaskFormModal.css';

const TaskFormModal = ({ show, onClose, onSave, taskData }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (taskData) {
            setTitle(taskData.title);
            setDescription(taskData.description);
            setStatus(taskData.status);
            setDueDate(taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : '');
        } else {
            setTitle('');
            setDescription('');
            setStatus('pending');
            setDueDate('');
        }
    }, [taskData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const task = { title, description, status, dueDate };
        onSave(task);
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{taskData ? 'Edit Task' : 'Create Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
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

export default TaskFormModal;
