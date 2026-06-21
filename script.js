document.addEventListener("DOMContentLoaded", () => {
  const typeButtons = document.querySelectorAll(".type-btn");
  const developmentTypeInput = document.getElementById("developmentType");
  const form = document.getElementById("siteForm");

  const locationInput = document.getElementById("location");
  const coordinatesInput = document.getElementById("coordinates");
  const cityInput = document.getElementById("city");

  // Development type buttons
  typeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      typeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      if (developmentTypeInput) {
        developmentTypeInput.value = button.dataset.type;
      }
    });
  });

  // Map setup
  let map;
  let marker;

  if (document.getElementById("map")) {
    map = L.map("map").setView([-17.8292, 31.0522], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap"
    }).addTo(map);

    marker = L.marker([-17.8292, 31.0522]).addTo(map);

    // Click map to set coordinates
    map.on("click", function (e) {
      const lat = e.latlng.lat.toFixed(5);
      const lng = e.latlng.lng.toFixed(5);

      marker.setLatLng(e.latlng);

      if (coordinatesInput) {
        coordinatesInput.value = lat + ", " + lng;
      }
    });
  }

  // Type location → update map
  async function searchLocation() {
    if (!locationInput || !map || !marker) return;

    const location = locationInput.value.trim();
    const city = cityInput ? cityInput.value : "";
    const query = `${location}, ${city}, Zimbabwe`;

    if (!location) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        map.setView([lat, lon], 15);
        marker.setLatLng([lat, lon]);

        if (coordinatesInput) {
          coordinatesInput.value = lat.toFixed(5) + ", " + lon.toFixed(5);
        }
      } else {
        alert("Location not found. Try adding the city, suburb, or nearby landmark.");
      }
    } catch (error) {
      console.error("Location search failed:", error);
      alert("Location search failed. Check your internet connection.");
    }
  }

  if (locationInput) {
    locationInput.addEventListener("change", searchLocation);
  }

  // Submit form → save data → go to report page
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const city = document.getElementById("city").value;
      const location = document.getElementById("location").value.trim();
      const coordinates = document.getElementById("coordinates").value.trim();
      const area = document.getElementById("area").value;
      const unit = document.getElementById("unit").value;
      const type = document.getElementById("developmentType").value;

      if (!location || !area) {
        alert("Please enter a site location and site area.");
        return;
      }

      localStorage.setItem("urbanpulse_city", city);
      localStorage.setItem("urbanpulse_location", location);
      localStorage.setItem("urbanpulse_coordinates", coordinates);
      localStorage.setItem("urbanpulse_area", area);
      localStorage.setItem("urbanpulse_unit", unit);
      localStorage.setItem("urbanpulse_type", type);

      window.location.href = "report.html";
    });
  }
});