document.addEventListener("DOMContentLoaded", () => {

  const locationInput = document.getElementById("locationInput");
  const results = document.getElementById("results");
  const currentBtn = document.getElementById("currentLocation");

  if (!locationInput) {
    console.error("locationInput not found");
    return;
  }

  // 🔹 Show suggestions while typing (FROM DATABASE)
  if (results) {
    locationInput.addEventListener("input", async () => {

      const value = locationInput.value.trim();
      results.innerHTML = "";

      if (value === "") return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/locations?search=${value}`
        );

        const data = await response.json();

        if (!data || data.length === 0) return;

        data.forEach(loc => {
          const div = document.createElement("div");
          div.className = "result-item";
          div.innerHTML = `<strong>${loc.location}</strong>`;

          div.addEventListener("click", () => {
            localStorage.setItem("selectedLocation", loc.location);
            window.location.href = "index.html";
          });

          results.appendChild(div);
        });

      } catch (error) {
        console.error("Error fetching locations:", error);
      }

    });
  }

  // 🔹 Press Enter → Save and go back
  locationInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = locationInput.value.trim();
      if (value !== "") {
        localStorage.setItem("selectedLocation", value);
        window.location.href = "index.html";
      }
    }
  });

  // 🔹 Current Location Button
  if (currentBtn) {
    currentBtn.addEventListener("click", () => {

      if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );

          const data = await response.json();

          const area =
            data.address.suburb ||
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county;

          if (area) {
            localStorage.setItem("selectedLocation", area.trim());
          } else {
            alert("Unable to detect area name");
            return;
          }

          window.location.href = "index.html";

        } catch (error) {
          alert("Unable to detect location name");
        }

      }, () => {
        alert("Location permission denied");
      });

    });
  }

});
