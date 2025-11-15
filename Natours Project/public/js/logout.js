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
      url: `${window.location.protocol}//${window.location.host}/api/v1/users/logout`,
    });
    alert('Logged Out');
    console.log('Logout successful: ', response.data);
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
