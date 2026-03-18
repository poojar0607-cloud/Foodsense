// ✅ Get query parameters
const params = new URLSearchParams(window.location.search);

const food = params.get("food") || "";
const locationParam = params.get("location") || "";
const cuisine = params.get("cuisine") || "";
const veg_type = params.get("veg_type") || "";
const price_range = params.get("price_range") || "";
const min_rating = params.get("min_rating") || "";

// ✅ Build CLEAN query string (NO line breaks)
const query =
  "http://localhost:3000/api/restaurants?" +
  "food=" + encodeURIComponent(food) +
  "&location=" + encodeURIComponent(locationParam) +
  "&cuisine=" + encodeURIComponent(cuisine) +
  "&veg_type=" + encodeURIComponent(veg_type) +
  "&price_range=" + encodeURIComponent(price_range) +
  "&min_rating=" + encodeURIComponent(min_rating);

// ✅ Fetch data
fetch(query)
  .then(res => res.json())
  .then(data => {

    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";
    resultsContainer.innerHTML = "<p class='search-title'>Search Results</p>";

    if (!data || data.length === 0) {
      resultsContainer.innerHTML += "<p>No restaurants found.</p>";
      return;
    }

    data.forEach((restaurant, index) => {

      // ✅ Open / Closed logic
      let status = "Closed";
      let statusColor = "red";

      if (restaurant.opening_time && restaurant.closing_time) {

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const [openH, openM] = restaurant.opening_time.split(":");
        const [closeH, closeM] = restaurant.closing_time.split(":");

        const openTime = parseInt(openH) * 60 + parseInt(openM);
        const closeTime = parseInt(closeH) * 60 + parseInt(closeM);

        if (currentTime >= openTime && currentTime <= closeTime) {
          status = "Open";
          statusColor = "green";
        }
      }

      const resultDiv = document.createElement("div");
      resultDiv.classList.add("result-card");

      resultDiv.innerHTML = `
        <div class="result-header">
          <h2 class="restaurant-name">
            ${index + 1}) ${restaurant.name}, ${restaurant.location}
          </h2>

          <div class="left-section" onclick="toggleDetails(${index})">
            <span class="arrow" id="arrow-${index}">v</span>
            <span class="rating">⭐ ${restaurant.rating}</span>
          </div>
        </div>

        <div class="hidden-content" id="details-${index}" style="display:none;">
          <div class="oval-box">

            <div class="oval-row">
              <span>${restaurant.cuisine}</span>
              <span class="open-status" style="color:${statusColor}; font-weight:bold;">
                ${status}
              </span>
              <span>${restaurant.food}</span>
            </div>

            <div class="center-btn">
              <a class="direction-btn" href="${restaurant.map_link}" target="_blank">
                ↪ Directions
              </a>
            </div>

          </div>
        </div>
      `;

      resultsContainer.appendChild(resultDiv);
    });

  })
  .catch(err => {
    console.error("Fetch error:", err);
  });


// ✅ Toggle Details
function toggleDetails(index) {
  const details = document.getElementById(`details-${index}`);
  const arrow = document.getElementById(`arrow-${index}`);

  if (details.style.display === "none") {
    details.style.display = "block";
    arrow.textContent = "^";
  } else {
    details.style.display = "none";
    arrow.textContent = "v";
  }
}


// ✅ Explore More (keeps other filters too)
function filterFood(foodType) {

  const params = new URLSearchParams(window.location.search);
  const location = params.get("location") || "";
  const cuisine = params.get("cuisine") || "";
  const veg = params.get("veg_type") || "";
  const price = params.get("price_range") || "";
  const rating = params.get("min_rating") || "";

  if (!location) {
    alert("Location not found.");
    return;
  }

  const newQuery =
    "search.html?food=" + encodeURIComponent(foodType) +
    "&location=" + encodeURIComponent(location) +
    "&cuisine=" + encodeURIComponent(cuisine) +
    "&veg_type=" + encodeURIComponent(veg) +
    "&price_range=" + encodeURIComponent(price) +
    "&min_rating=" + encodeURIComponent(rating);

  window.location.href = newQuery;
}
