import axios from 'axios';
import { toast } from 'react-toastify';

export const displayUserTasks = async userId => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axios.get(`http://localhost:4000/backend/task/show-tasks/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data && response.status === 200) {
      return { status: true, data: response };
    } else {
      toast.error('Error while login user');
    }
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);
    } else if (error.request) {
      toast.error(error.request);
    } else {
      toast.error(error.message);
    }
    return { status: false, message: error.message };
  }
};
