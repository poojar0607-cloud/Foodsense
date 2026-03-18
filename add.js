document.getElementById("restaurantForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const restaurantData = {
        name: document.getElementById("name").value,
        food: document.getElementById("food").value,
        cuisine: document.getElementById("cuisine").value,
        veg_type: document.getElementById("veg_type").value,
        location: document.getElementById("location").value,
        price_range: document.getElementById("price_range").value,
        rating: document.getElementById("rating").value,
        map_link: document.getElementById("map_link").value,
        opening_time: document.getElementById("opening_time").value,
        closing_time: document.getElementById("closing_time").value
    };

    fetch("http://localhost:3000/api/add-restaurant", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(restaurantData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            document.getElementById("restaurantForm").reset();
        } else {
            alert("Failed to add restaurant");
        }
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Server error while adding restaurant");
    });
});
