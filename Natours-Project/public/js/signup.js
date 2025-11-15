document.addEventListener('DOMContentLoaded', () => {
  console.log('Signup JS loaded');
  const signupForm = document.querySelector('.form');
  if (!signupForm) return;

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    console.log(name, email, password, passwordConfirm);
    await signup(name, email, password, passwordConfirm);
  });
});

const signup = async (name, email, password, passwordConfirm) => {
  try {
    data = {
      name: name,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    };
    const responce = await axios({
      method: 'POST',
      url: `/api/v1/users/signup`,
      data: data,
    });
    alert('Signed Up Successfully');
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
