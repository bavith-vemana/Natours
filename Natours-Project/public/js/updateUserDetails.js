const updateUserDetails = async (name, email, selectedPhoto) => {
  try {
    const form = new FormData();
    if (name) {
      form.append('updatedName', name);
    }

    if (email) {
      form.append('updatedEmail', email);
    }

    if (selectedPhoto) {
      form.append('updatedPhoto', selectedPhoto);
    }

    const apiOptions = {
      method: 'PATCH',
      url: `/api/v1/users/updateMe`,
      data: form,
    };
    // FormData with axios automatically sets correct Content-Type header with boundary
    const response = await axios(apiOptions);
    alert('Updated Successfully');
  } catch (err) {
    console.log('not submitted');
    console.log(err);
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
  if (photoInput) {
    photoInput.addEventListener('change', () => {
      if (photoInput.files.length > 0) {
        selectedPhoto = photoInput.files[0];
      }
    });
  }

  // Handle form submit
  saveSettings.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

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
