const login = async (email, password) => {
  try {
    // console.log(email, password);
    data = { email, password };
    const responce = await axios({
      method: 'POST',
      url: `${window.location.protocol}//${window.location.host}/api/v1/users/login`,
      data: data,
    });

    alert('Logged In');
    setTimeout(() => {
      window.location.href = '/';
    }, 100);

    console.log('Login successful: ', response.data);
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
    console.error('Login form not found!');
    return;
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
    // console.log(email, password);
  });
});
