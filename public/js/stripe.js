/* eslint-disable*/

import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const stripe = await loadStripe(
      'pk_test_51HDT8sCmNC9WXSkXga2sPOf4Nw2nknuFx0hV2xW6JoMWGGexFHgLdNZou6r6gFpVTHA96mYJMxZPULKy8gjpYVCu002i7qh023'
    );
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
