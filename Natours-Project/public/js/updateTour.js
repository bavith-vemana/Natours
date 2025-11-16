document.addEventListener('DOMContentLoaded', () => {

  const tourForm = document.getElementById('editTourForm');
  const numDaysInput = document.getElementById('numDays');
  const generateBtn = document.getElementById('generateDays');
  const container = document.getElementById('dailyDetailsContainer');

  // Event: Generate daily details
  generateBtn.addEventListener('click', () => {
    const numDays = parseInt(numDaysInput.value);
    if (!numDays || numDays <= 0) return;
    generateDailyDetails(numDays, container);
  });

  // Event: Form submission
  tourForm.addEventListener('submit', submitForm);
});

// Generate daily fields + maps dynamically
function generateDailyDetails(numDays, container) {
  container.innerHTML = ''; // Clear previous fields

  for (let i = 1; i <= numDays; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('daily-detail');
    dayDiv.style.border = '1px solid #ddd';
    dayDiv.style.padding = '10px';
    dayDiv.style.marginBottom = '10px';

    let html = `<h4>Day ${i}</h4>`;

    if (i === 1) {
      html += `
        <label>Address:</label>
        <input type="text" name="day1Address" class="form__input" placeholder="Enter address" required>
      `;
    }

    html += `
      <label>Description:</label>
      <textarea name="day${i}Description" class="form__input" rows="3" placeholder="Enter description" required></textarea>
      <label>Location:</label>
      <input type="text" name="day${i}Location" class="form__input" placeholder="Select location on map" readonly>
      <div id="map${i}" style="height:200px; margin-top:10px;"></div>
    `;

    dayDiv.innerHTML = html;
    container.appendChild(dayDiv);

    initMap(dayDiv, i);
  }
}

// Initialize Leaflet map for a day
function initMap(dayDiv, day) {
  const map = L.map(`map${day}`).setView([25.774772, -80.185942], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  const marker = L.marker([25.774772, -80.185942], { draggable: true }).addTo(
    map,
  );

  marker.on('dragend', (e) => {
    const { lat, lng } = e.target.getLatLng();
    dayDiv.querySelector(`input[name="day${day}Location"]`).value =
      `${lat},${lng}`;
  });

  map.on('click', (e) => {
    marker.setLatLng(e.latlng);
    dayDiv.querySelector(`input[name="day${day}Location"]`).value =
      `${e.latlng.lat},${e.latlng.lng}`;
  });
}

// Collect daily details into structured payload
function collectDailyDetails() {
  const dayDivs = document.querySelectorAll('.daily-detail');
  const dailyDetailsPayload = [];

  dayDivs.forEach((dayDiv, index) => {
    const day = index + 1;
    const descInput = dayDiv.querySelector(
      `textarea[name="day${day}Description"]`,
    ).value;
    const locInput = dayDiv.querySelector(
      `input[name="day${day}Location"]`,
    ).value;

    let coordinates = null;
    if (locInput) {
      const parts = locInput.split(',').map(Number);
      coordinates = [parts[1], parts[0]]; // GeoJSON [lng, lat]
    }

    const dayData = {
      type: 'Point',
      coordinates,
      description: descInput,
      day,
    };

    if (day === 1) {
      const address = dayDiv.querySelector(`input[name="day1Address"]`).value;
      dayData.address = address;
    }

    dailyDetailsPayload.push(dayData);
  });

  const startLocation = dailyDetailsPayload[0];
  const locations = dailyDetailsPayload.map((dayData) => {
    const clone = { ...dayData };
    if (clone.address) delete clone.address;
    return clone;
  });

  return { startLocation, locations };
}

// Handle form submission
async function submitForm(e) {
  e.preventDefault();

  const tourForm = e.target;
  const tourName = document.getElementById('name').value;
  const duration = document.getElementById('duration').value;
  const difficulty = document.getElementById('difficulty').value;
  const maxGroupSize = document.getElementById('maxGroupSize').value;
  const description = document.getElementById('description').value;

  const { startLocation, locations } = collectDailyDetails();

  const form = new FormData();
  form.append('name', tourName);
  form.append('duration', duration);
  form.append('difficulty', difficulty);
  form.append('maxGroupSize', maxGroupSize);
  form.append('description', description);
  if (startLocation) {
    form.append('startLocation', JSON.stringify(startLocation));
  }
  if (locations.length > 0) {
    form.append('locations', JSON.stringify(locations));
  }
  await updateTour(form, tourForm.dataset.tourId);
}

// Send PATCH request to backend
async function updateTour(formData, tourId) {
  try {
    const res = await fetch(`/api/v1/tours/${tourId}`, {
      method: 'PATCH',
      body: formData,
    });

    const data = await res.json();
    window.location.href = `/tour/${tourId}`;
  } catch (err) {
    console.error('Error updating tour:', err);
    alert('An error occurred while updating the tour.');
  }
}
