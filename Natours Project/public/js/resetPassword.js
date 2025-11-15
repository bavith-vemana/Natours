const changePassword = async (password) => {
  try {
    data = {
      password: password,
    };
    const responce = await axios({
      method: 'PATCH',
      url: `${window.location.protocol}//${window.location.host}/api/v1/users/resetpassword/${resetToken}`,
      data: data,
    });
    alert('updated Sucessfully');
    console.log(responce.data);
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  } catch (err) {
    alert('not updated');
    console.log(err.data);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const updatePasswordForm = document.querySelector('.form');
  updatePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('reset token:', resetToken);
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPass').value;
    console.log(newPassword, confirmPassword);
    if (newPassword !== confirmPassword) {
      alert('password not matching');
    }
    changePassword(newPassword);
  });
});
