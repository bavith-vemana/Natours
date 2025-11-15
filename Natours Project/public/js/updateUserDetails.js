const updateUserDetails = async (name, email, selectedPhoto) => {
  try {
    const form = new FormData();
    form.append('updatedEmail', email);
    form.append('updatedName', name);
    if (selectedPhoto) {
      form.append('updatedPhoto', selectedPhoto);
    }
    // data = {
    //   updatedEmail: email,
    //   updatedName: name,
    //   updatedPhoto: selectedPhoto,
    // };
    const apiOptions = {
      method: 'PATCH',
      url: `${window.location.protocol}//${window.location.host}/api/v1/users/updateMe`,
      data: form,
      Headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await axios(apiOptions);
    alert('Updated Successfully');
    console.log(response.data);
  } catch (err) {
    console.log('not submitted');
    console.log(err.data);
  }
};
document.addEventListener('DOMContentLoaded', () => {
  const saveSettings = document.querySelector('.form-user-data');
  const choosePhotoBtn = document.getElementById('choosePhoto');
  const photoInput = document.getElementById('photo');
  let selectedPhoto;

  // Trigger file upload dialog when clicking “Choose new photo”
  choosePhotoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    photoInput.click();
  });

  // Capture selected file
  photoInput.addEventListener('change', () => {
    if (photoInput.files.length > 0) {
      selectedPhoto = photoInput.files[0];
      console.log('Selected file:', selectedPhoto.name);
    }
  });

  // Handle form submit
  saveSettings.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // console.log('good till here');

    updateUserDetails(name, email, selectedPhoto);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('userPhoto');
  const modal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalImage');
  const close = document.getElementById('closeModal');

  // Open modal when image is clicked
  img.addEventListener('click', () => {
    modal.style.display = 'block';
    modalImg.src = img.src;
  });

  // Close modal when '×' is clicked
  close.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside the image
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
});
