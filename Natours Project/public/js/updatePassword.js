const updatePassword = async (oldPassword, newPassword) => {
  try {
    const apiOptions = {
      method: 'PATCH',
      url: `${window.location.protocol}//${window.location.host}/api/v1/users/updatepassword`,
      data: {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
    };
    const responce = await axios(apiOptions);
    alert('updated Sucessfully');
    console.log(responce.data);
    // await axios({
    //   method: 'GET',
    //   url: 'http://localhost:5600/api/v1/users/logout',
    // });
    // setTimeout(() => {
    //   window.location.href = '/login';
    // }, 500);
    // await logout();
    // setTimeout(() => {
    //   window.location.href = '/login';
    // }, 1000);
  } catch (err) {
    alert('not updated');
    console.log(err.data);
  }
};
// import { logout } from './logout';
document.addEventListener('DOMContentLoaded', () => {
  const updatePasswordForm = document.querySelector('.form-user-settings');
  updatePasswordForm.addEventListener('submit', (e) => {
    console.log('in');
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    console.log(currentPassword);
    console.log(password);
    console.log(confirmPassword);
    if (password !== confirmPassword) {
      alert('password is not matching');
    }
    updatePassword(currentPassword, password);
  });
});

// console.log('out');
