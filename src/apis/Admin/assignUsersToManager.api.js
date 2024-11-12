// src/apis/Admin/assignUsersToManager.api.js
import axios from 'axios';
import { toast } from 'react-toastify';

//Could be followed much better approch. but everything need of time.

export const assignUsersToManager = async (managerId, userIds) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      'http://localhost:4000/backend/admin/assign-users',
      {
        managerId,
        userIds
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data && response.status === 200) {
      return { status: true, data: response.data };
    } else {
      toast.error('Error while assigning users to manager');
      return { status: false };
    }
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
    return { status: false, message: error.message };
  }
};
