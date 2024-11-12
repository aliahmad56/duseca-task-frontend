import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTasks,
  faCalendarAlt,
  faCircle,
  faEdit,
  faTrash,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './dashboard.css';
import TaskFormModal from '../Modals/TaskFormModal';
import AuthContext from '../../context/auth.context';

import Navbar from '../Header';
import { createUserTask } from '../../apis/tasks/createTask';
import { displayUserTasks } from '../../apis/tasks/showTasks';
import { deleteUserTasks } from '../../apis/tasks/removeTask';
import { updateUserTask } from '../../apis/tasks/updateTask';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { userId } = useContext(AuthContext);

  useEffect(() => {
    if (userId) {
      fetchTasks(userId);
    }
  }, [userId]);

  const fetchTasks = async userId => {
    try {
      const response = await displayUserTasks(userId);
      console.log('FUll reposne in dashboard component', response);

      if (response.status === true) {
        setTasks(response.data.data.tasks);
      } else {
        toast.error('Failed to load tasks');
      }
    } catch (error) {
      toast.error('Error fetching tasks: ' + error.message);
    }
  };

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  const handleEditTask = taskId => {
    const taskToEdit = tasks.find(task => task._id === taskId);
    setSelectedTask(taskToEdit);
    setShowModal(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleSaveTask = async taskData => {
    setShowModal(false);
    const formattedTaskData = {
      ...taskData,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : ''
    };

    if (selectedTask) {
      try {
        const response = await updateUserTask(selectedTask._id, formattedTaskData);
        if (response.status) {
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task._id === selectedTask._id ? { ...task, ...formattedTaskData } : task
            )
          );
          toast.success('Task updated successfully');
        } else {
          toast.error('Failed to update task');
        }
      } catch (error) {
        toast.error('Error updating task: ' + error.message);
      }
    } else {
      try {
        const response = await createUserTask(
          formattedTaskData.title,
          formattedTaskData.description,
          formattedTaskData.dueDate,
          formattedTaskData.status
        );
        toast.success(response.data.message);

        if (response && response.data && response.data.task && response.data.status === true) {
          setTasks(prevTasks => [...prevTasks, response.data.task]);
        } else {
          console.error(
            'Task creation failed:',
            response.data?.message || 'Unexpected response format'
          );
        }
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  const handleDeleteTask = async taskId => {
    try {
      const response = await deleteUserTasks(taskId);

      if (response.status === true) {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        toast.success('Task deleted successfully');
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      toast.error('Error deleting task: ' + error.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="filter-section">
          <label>Filter by Status:</label>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button className="create-task-button" onClick={handleCreateTask}>
            <FontAwesomeIcon icon={faPlus} /> Create Task
          </button>
        </div>
        <table className="task-table">
          <thead>
            <tr>
              <th>
                <FontAwesomeIcon icon={faTasks} /> Title
              </th>
              <th>Description</th>
              <th>
                <FontAwesomeIcon icon={faCircle} /> Status
              </th>
              <th>
                <FontAwesomeIcon icon={faCalendarAlt} /> Due Date
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task._id}>
                <td>{task.title || 'No title'}</td>
                <td>{task.description || 'No description'}</td>
                <td className={`status-${task.status.toLowerCase()}`}>
                  {task.status || 'Unknown'}
                </td>
                <td>
                  {task.dueDate
                    ? new Date(task.dueDate).toISOString().split('T')[0]
                    : 'No due date'}
                </td>
                <td className="action-buttons">
                  <button onClick={() => handleEditTask(task._id)} className="edit-button">
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task._id)} className="delete-button">
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <TaskFormModal
            show={showModal}
            onClose={handleCloseModal}
            onSave={handleSaveTask}
            taskData={selectedTask}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
