/* eslint-disable*/

import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatepassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// export const updatePassword = async (
//   currentPassword,
//   newPassword,
//   ConfirmPassword
// ) => {
//   try {
//     console.log(currentPassword, password, ConfirmPassword);
//     const res = await axios({
//       method: 'PATCH',
//       url: 'http://127.0.0.1:3000/api/v1/users/updatepassword',
//       data: {
//         passwordCurent: currentPassword,
//         password: newPassword,
//         passwordConfirm: ConfirmPassword,
//       },
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'Data is updated');
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };
