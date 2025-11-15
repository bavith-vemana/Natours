document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
    // Redirect after clearing cookies
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  });
});
const logout = async () => {
  try {
    const responce = await axios({
      method: 'GET',
      url: `/api/v1/users/logout`,
    });
    alert('Logged Out');
  } catch (err) {
    if (err.response) {
      alert(err.response.data.message);
      console.error('Error message: ', err.response.data);
    } else {
      console.error('Network error:', err.message);
    }
  }
};

export { logout };
