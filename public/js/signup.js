/* eslint-disable*/

import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (data) => {
  // console.log(email, password);
  console.log(data);
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// export const signup = async (data) => {
//   console.log(data);
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: '/api/v1/users/signup',
//       data: data,
//     });
//     if (res.data.status === 'success') {
//       showAlert('success', 'Sign up Successfully');
//       window.setTimeout(() => {
//         location.assign('/');
//       }, 1000);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };
