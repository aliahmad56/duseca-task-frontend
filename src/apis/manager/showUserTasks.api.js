import axios from 'axios';
import { toast } from 'react-toastify';

// To call this api you will get the user tasks assign to a manager.
export const showUserTasks = async () => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axios.get('http://localhost:4000/backend/manager/tasks/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data && response.status === 200) {
      return { status: true, data: response };
    } else {
      toast.error('Error while showing manager tasks');
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
