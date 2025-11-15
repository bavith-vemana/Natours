const updatePassword = async (oldPassword, newPassword) => {
  try {
    const apiOptions = {
      method: 'PATCH',
      url: `/api/v1/users/updatepassword`,
      data: {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
    };
    const responce = await axios(apiOptions);
    alert('updated Sucessfully');

  } catch (err) {
    alert('not updated');
    console.log(err.data);
  }
};
// import { logout } from './logout';
document.addEventListener('DOMContentLoaded', () => {
  const updatePasswordForm = document.querySelector('.form-user-settings');
  updatePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    if (password !== confirmPassword) {
      alert('password is not matching');
    }
    updatePassword(currentPassword, password);
  });
});

// console.log('out');
