/*eslint-disable*/

import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { signup } from './signup';
import { bookTour } from './stripe';
import { forgotPassword, resetPassword } from './passwordSettings';
//DOM Element
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const forgotbtn = document.querySelector('.form--forgotpassword');
// const resetForm = document.querySelector('.form--resetpassword');
const resetBtn = document.getElementById('reset-token');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
// const bookBtn = document.getElementById('book-tour');
const bookBtn = document.getElementById('book-tour');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signForm) {
  signForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup({ name, email, password, passwordConfirm });
  });
}

if (forgotbtn) {
  forgotbtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-forgotpassword').textContent = 'sending....';
    const email = document.getElementById('email').value;
    // console.log(email);
    await forgotPassword(email);
    document.querySelector('.btn-forgotpassword').textContent = 'submit';
  });
}
if (resetBtn) {
  resetBtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-resetpassword').textContent = 'resetting....';
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const token = e.target.dataset.token;
    // console.log(password, passwordConfirm, token);
    await resetPassword(password, passwordConfirm, token);
    document.querySelector('.btn-resetpassword ').textContent = 'submit';
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-save-settings').textContent = 'updating....';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateSettings(form, 'data');
    document.querySelector('.btn-save-settings').textContent = 'submit';
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'updating....';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-Confirm').value = '';
  });

// if (bookBtn) {
//   bookBtn.addEventListener('click', (e) => {
//     e.target.textContent = 'uploading...';
//     const { tourId } = e.target.dataset;
//     bookTour(tourId);
//   });
// }
if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    // console.log(tourId);
    bookTour(tourId);
  });
