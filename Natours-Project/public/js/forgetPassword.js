const sendMail = async (email) => {
  try {
    data = {
      email: email,
    };
    const responce = await axios({
      method: 'POST',
      url: `/api/v1/users/forgetpassword`,
      data: data,
    });
    alert('please check Your Inbox');
  } catch (err) {
    alert(err.response.data.message + ' Please check Email Id');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    const updatePasswordForm = document.querySelector('.form');
    updatePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      sendMail(email);
    });
  } catch (err) {
    alert('Not Sent');
    console.log(err.message);
  }
});
