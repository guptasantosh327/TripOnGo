/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const forgotPassword = async (email) => {
  try {
    console.log(email);
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotpassword',
      data: {
        email,
      },
    });
    if (res.data.status == 'success') {
      showAlert('success', 'password reset email is sent! Please hurry up ');
    }
  } catch (err) {
    console.log(err)
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (password, passwordConfirm, token) => {
  console.log(password, passwordConfirm, token);
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetpassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password reset successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
