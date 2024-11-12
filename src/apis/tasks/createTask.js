import axios from 'axios';
import { toast } from 'react-toastify';

//haya object pass kore.
export const createUserTask = async (title, discription, dueDate, status) => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axios.post(
      'http://localhost:4000/backend/task/create-task',
      { title, discription, dueDate, status },

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('FUll reposne is', response);
    if (response.data && response.data.status === true) {
      return { status: true, data: response.data };
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
