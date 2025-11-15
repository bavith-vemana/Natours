const stripe = Stripe(
  'pk_test_51SOy6m2OxkrAauVzp0MtSzbt4JOWJ48mTKbcbn7u0tGvT0ulCpUYUSnjTDBXNRmokNn2Ndu7TTUqw4igutgHBRym00alCxNNm4',
);
document.addEventListener('DOMContentLoaded', () => {
  const bookBtn = document.querySelector('#bookNow');
  const cancelBtn = document.querySelector('#cancelBooking');
  if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
      const { tourId } = e.target.dataset;
      bookTour(tourId);
    });
  }
  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      const { tourId } = e.target.dataset;

      cancelTour(tourId);
    });
  }
});

const cancelTour = async (tourId) => {
  try {
    const apiOptions = {
      method: 'DELETE',
      url: `/api/v1/bookings/deleteBooking/${tourId}`,
    };
    const responce = await axios(apiOptions);
    window.location.reload();
  } catch (err) {
    if (err.response) {
      alert(err.response.data.message);
      console.error('Error message: ', err.response.data);
    } else {
      console.error('Network error:', err.message);
    }
  }
};
const bookTour = async (tourId) => {
  //1) get the session from API
  const apiOptions = {
    method: 'GET',
    url: `/api/v1/bookings/checkout-session/${tourId}`,
  };
  const session = await axios(apiOptions);
  //2) create checkout form + charge credit card
  await stripe.redirectToCheckout({
    sessionId: session.data.session.id,
  });
};
