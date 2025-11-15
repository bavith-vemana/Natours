const sendMail = async (email) => {
  try {
    data = {
      email: email,
    };
    const responce = await axios({
      method: 'POST',
      url: `${window.location.protocol}//${window.location.host}/api/v1/users/forgetpassword`,
      data: data,
    });
    alert('please check Your Inbox');
    console.log(responce.data);
  } catch (err) {
    alert(err.response.data.message + ' Please check Email Id');
    console.log(err.response.data.message);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    const updatePasswordForm = document.querySelector('.form');
    updatePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      console.log(email);
      sendMail(email);
    });
  } catch (err) {
    alert('Not Sent');
    console.log(err.message);
  }
});
