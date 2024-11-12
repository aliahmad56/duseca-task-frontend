import axios from 'axios';
import { toast } from 'react-toastify';

//Could be followed much better approch. but everything need of time.

export const createUser = async userData => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axios.post(
      'http://localhost:4000/backend/admin/add-user',
      userData,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data && response.data.status === true) {
      return { status: true, data: response.data };
    } else {
      toast.error('Error while adding user');
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
