document.addEventListener('DOMContentLoaded', () => {
  console.log('Create Review Page Loaded');
  const reviewForm = document.querySelector('.form--create-review');

  if (!reviewForm) {
    return;
  }
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;
    const tourId = document.getElementById('tourId').value;
    await createReview(rating, review, tourId);
  });
});

const createReview = async (rating, review, tourId) => {
  try {
    const data = { review, rating };

    const response = await axios.post(`/api/v1/tours/${tourId}/review`, data, {
      withCredentials: true, // sends cookies automatically
    });

    alert('Review Submitted Successfully');
    window.location.href = `/tour/${tourId}`;
  } catch (err) {
    if (err.response) {
      alert(err.response.data.message);
      console.error('Error message:', err.response.data);
    } else {
      console.error('Network error:', err.message);
    }
    window.location.href = `/tour/${tourId}`;
  }
};
