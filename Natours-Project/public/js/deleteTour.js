document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('.delete-tour');
  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = e.target.closest('.card');
      if (!card) return;

      const tourId = card.querySelector('input[name="tourId"]').value;
      deleteTour(tourId);
    });
  });
});

const deleteTour = async (tourId) => {
  try {
    const axiosoptions = {
      method: 'DELETE',
      url: `/api/v1/tours/${tourId}`,
      withCredentials: true,
    };
    const res = await axios(axiosoptions);
    alert('Tour deleted successfully!');
    location.reload();
  } catch (err) {
    if (err.response) {
      alert(err.response.data.message);
      console.error('Error message: ', err.response.data);
    } else {
      console.error('Network error:', err.message);
    }
  }
};
