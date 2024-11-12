import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTrash, faTasks, faUserTie } from '@fortawesome/free-solid-svg-icons';
import UserFormModal from '../Modals/UserFormModal';
import AssignUserModal from '../Modals/AssignUserModal';
import TableComponent from '../Table/TableComponent';

import { getAllUsers } from '../../apis/Admin/displayAllUsers.api';
import { createUser } from '../../apis/Admin/addUsers.api';
import { deleteUser } from '../../apis/Admin/removeUser.api';
import { displayUserTasks } from '../../apis/Admin/getAllTasks.api';
import { assignUsersToManager } from '../../apis/Admin/assignUsersToManager.api';
import Header from '../Header';
import './AdminDashboard.css';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users and tasks on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await getAllUsers();
        const allUsers = usersResponse.data.data.users;
        setUsers(allUsers);
        setManagers(allUsers.filter(user => user.role === 'manager'));
        console.log('all manager data is', managers);

        const tasksResponse = await displayUserTasks();
        setTasks(tasksResponse.data.data.tasks);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle adding a new user
  const handleUserSave = async userData => {
    try {
      const response = await createUser(userData);
      setUsers([...users, response.data.user]);
      setIsUserModalOpen(false);
      toast.success('User created successfully');
    } catch (error) {
      console.error('Error creating user', error);
    }
  };

  // Handle deleting a user
  const handleUserDelete = async (userId, role) => {
    try {
      await deleteUser(userId, role);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  // Handle assigning users to a manager
  const handleAssignUsers = async (managerId, userIds) => {
    try {
      const response = await assignUsersToManager(managerId, userIds);
      if (response.status) {
        toast.success('Users assigned successfully');
      }
    } catch (error) {
      console.error('Error assigning users', error);
      toast.error('Failed to assign users');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <Header />
      <h1>Admin Dashboard</h1>

      {/* User Management Section */}
      <div className="user-management">
        <h2>User Management</h2>
        <div className="button-container">
          <button className="create-user-button" onClick={() => setIsUserModalOpen(true)}>
            <FontAwesomeIcon icon={faUserPlus} /> Create User
          </button>
          <button className="assign-user-button" onClick={() => setIsAssignModalOpen(true)}>
            <FontAwesomeIcon icon={faUserTie} /> Assign Users to Manager
          </button>
        </div>

        <TableComponent
          data={users}
          headers={['Name', 'Email', 'Role', 'Actions']}
          renderRow={user => (
            <>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleUserDelete(user._id, user.role)}
                  className="delete-button"
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </td>
            </>
          )}
        />
      </div>

      {/* Task Management Section */}
      <div className="task-management">
        <h2>Task Management</h2>
        <TableComponent
          data={tasks}
          headers={['Title', 'Description', 'Assigned To', 'Status', 'Actions']}
          renderRow={task => (
            <>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.assignedTo}</td>
              <td>{task.status}</td>
              <td>
                <button className="edit-button">
                  <FontAwesomeIcon icon={faTasks} /> Edit
                </button>
                <button className="delete-button">
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </td>
            </>
          )}
        />
      </div>

      {/* Assign User Modal */}
      {isAssignModalOpen && (
        <AssignUserModal
          show={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          managers={managers}
          users={users.filter(user => user.role === 'user')}
          onAssign={handleAssignUsers}
        />
      )}

      {/* User Form Modal for Create */}
      {isUserModalOpen && (
        <UserFormModal
          show={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          onSave={handleUserSave}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
