import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faTrash, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import TableComponent from '../Table/TableComponent';
import TaskFormModal from '../Modals/TaskFormModal';
import { toast } from 'react-toastify';
import Header from '../Header';
import { displayManagerTasks } from '../../apis/manager/showManagerTask.api';
import { showUserTasks } from '../../apis/manager/showUserTasks.api';
import { createUserTask } from '../../apis/tasks/createTask';
import { deleteUserTasks } from '../../apis/tasks/removeTask';
import { updateUserTask } from '../../apis/tasks/updateTask';

import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await displayManagerTasks();
        if (response.status) {
          setTasks(response.data.data.tasks);
        }
      } catch (error) {
        console.error('Error fetching manager tasks', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserTasks = async () => {
      try {
        const response = await showUserTasks();
        console.log('Full api response inside the manager dashabord', response);
        if (response.data.data.status) {
          setUserTasks(response.data.data.tasks);
        }
      } catch (error) {
        console.error('Error fetching user tasks', error);
      }
    };

    fetchTasks();
    fetchUserTasks();
  }, []);

  const filteredTasks =
    filterStatus === 'All' ? tasks : tasks.filter(task => task.status === filterStatus);

  const handleCreateTask = () => {
    setCurrentTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = task => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async taskData => {
    setIsTaskModalOpen(false);
    const formattedTaskData = {
      ...taskData,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : ''
    };

    if (currentTask) {
      try {
        const response = await updateUserTask(currentTask._id, formattedTaskData);
        if (response.status) {
          setTasks(
            tasks.map(task => (task._id === currentTask._id ? response.data.data.task : task))
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
        if (response && response.data && response.data.status === true) {
          setTasks([...tasks, response.data.task]);
          toast.success('Task created successfully');
        } else {
          toast.error('Task creation failed');
        }
      } catch (error) {
        toast.error('Error creating task: ' + error.message);
      }
    }
  };

  const handleDeleteTask = async taskId => {
    try {
      const response = await deleteUserTasks(taskId);
      if (response.status === true) {
        setTasks(tasks.filter(task => task._id !== taskId));
        toast.success('Task deleted successfully');
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      toast.error('Error deleting task: ' + error.message);
    }
  };

  const handleDeleteUserTask = async taskId => {
    try {
      const response = await deleteUserTasks(taskId);
      if (response.status === true) {
        setUserTasks(userTasks.filter(task => task._id !== taskId));
        toast.success('User task deleted successfully');
      } else {
        toast.error('Failed to delete user task');
      }
    } catch (error) {
      toast.error('Error deleting user task: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manager-dashboard-container">
      <Header />
      <h1 className="heading-text">Manager Dashboard</h1>

      {/* Filter Section */}
      <div className="filter-section">
        <label>Filter Tasks by Status:</label>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button className="create-task-button" onClick={handleCreateTask}>
          <FontAwesomeIcon icon={faPlus} /> Create Task
        </button>
      </div>

      {/* Manager's Own Tasks */}
      <div className="task-section">
        <h2>My Tasks</h2>
        <TableComponent
          data={filteredTasks}
          headers={['Title', 'Description', 'Status', 'Due Date', 'Actions']}
          renderRow={task => (
            <>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>
                <button onClick={() => handleEditTask(task)} className="edit-button">
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button onClick={() => handleDeleteTask(task._id)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </td>
            </>
          )}
        />
      </div>

      {/* User Tasks */}
      <div className="task-section">
        <h2>User Tasks</h2>
        <TableComponent
          data={userTasks}
          headers={['Title', 'Description', 'Status', 'Due Date', 'Actions']}
          renderRow={task => (
            <>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>
                <button onClick={() => handleDeleteUserTask(task._id)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </td>
            </>
          )}
        />
      </div>

      {isTaskModalOpen && (
        <TaskFormModal
          show={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleSaveTask}
          taskData={currentTask}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
