const login = async (email, password) => {
  try {
    data = { email, password };
    const responce = await axios({
      method: 'POST',
      url: `/api/v1/users/login`,
      data: data,
    });

    alert('Logged In');
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  } catch (err) {
    if (err.response) {
      alert(err.response.data.message);
      console.error('Error message: ', err.response.data);
    } else {
      console.error('Network error:', err.message);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.form');

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
});
