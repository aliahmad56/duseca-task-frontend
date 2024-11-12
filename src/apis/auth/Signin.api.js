import axios from 'axios';
import { toast } from 'react-toastify';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:4000/backend/auth/login', {
      email,
      password
    });
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
