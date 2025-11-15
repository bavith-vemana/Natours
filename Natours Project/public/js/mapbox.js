document.addEventListener('DOMContentLoaded', () => {
  const options = {
    scrollWheelZoom: true, // zoom with mouse wheel
    doubleClickZoom: true, // zoom on double click
    dragging: true, // allow dragging
    zoomControl: false, // disable + / - buttons
    touchZoom: 'center', // zoom around center on pinch
    boxZoom: true, // drag to zoom
    keyboard: true,
  };
  var map = L.map('map', options);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const points = [];

  data.forEach((location) => {
    const lat = Number(location.coordinates[1]);
    const lng = Number(location.coordinates[0]);
    points.push([lat, lng]);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(
        `<div style="
        font-size: 16px; 
        font-weight: 600; 
        line-height: 1.4; 
        text-align: center;">
        ${location.description}<br>
        <span style="font-size: 14px; font-weight: 500; color: #555;">
          Day - ${location.day}
        </span>
     </div>`,
      )
      .openPopup();
  });

  // Fit the map to show all points
  const bounds = L.latLngBounds(points);
  map.fitBounds(bounds);
});
