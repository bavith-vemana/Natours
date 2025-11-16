document.addEventListener('DOMContentLoaded', () => {
  console.log('Delete Review Script Loaded');

  const deleteButtons = document.querySelectorAll('.deleteReviewBtn');

  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Delete Review Button Clicked');

      // Get the closest card of the clicked button
      const card = e.target.closest('.card');
      if (!card) return;

      // Get the IDs from inputs inside this card
      const reviewIdInput = card.querySelector('input[name="reviewId"]').value;
      const tourIdInput = card.querySelector('input[name="tourId"]').value;

      deleteReview(reviewIdInput, tourIdInput);
    });
  });
});

const deleteReview = async (reviewId, tourId) => {
  try {
    const axiosOptions = {
      method: 'delete',
      url: `/api/v1/tours/${tourId}/review/${reviewId}`,
    };
    const response = await axios(axiosOptions);
    alert('Review Deleted Successfully');
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
