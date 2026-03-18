const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mahimanav@2007",
    database: "foodsense"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL ✅");
    }
});

// =====================================================
// ✅ ADD RESTAURANT
// =====================================================

app.post("/api/add-restaurant", (req, res) => {

    const {
        name,
        food,
        cuisine,
        veg_type,
        location,
        price_range,
        rating,
        map_link,
        opening_time,
        closing_time
    } = req.body;

    const sql = `
        INSERT INTO restaurants
        (name, food, cuisine, veg_type, location, price_range, rating, map_link, opening_time, closing_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [
            name,
            food,
            cuisine,
            veg_type,
            location,
            price_range,
            rating,
            map_link,
            opening_time,
            closing_time
        ],
        (err) => {
            if (err) {
                console.log("Insert Error:", err);
                return res.status(500).json({ error: "Failed to add restaurant" });
            }
            res.json({ message: "Restaurant added successfully!" });
        }
    );
});

// =====================================================
// ✅ SEARCH RESTAURANTS (FIXED FILTERS)
// =====================================================

app.get("/api/restaurants", (req, res) => {

    console.log("Incoming Filters:", req.query);

    const {
        food,
        location,
        cuisine,
        veg_type,
        price_range,
        min_rating
    } = req.query;

    let sql = "SELECT * FROM restaurants WHERE 1=1";
    let values = [];

    if (food && food.trim() !== "") {
        sql += " AND LOWER(food) LIKE LOWER(?)";
        values.push(`%${food.trim()}%`);
    }

    if (location && location.trim() !== "") {
        sql += " AND LOWER(location) LIKE LOWER(?)";
        values.push(`%${location.trim()}%`);
    }

    if (cuisine && cuisine !== "All" && cuisine.trim() !== "") {
        sql += " AND LOWER(cuisine) = LOWER(?)";
        values.push(cuisine.trim());
    }

    if (veg_type && veg_type !== "All" && veg_type.trim() !== "") {
        sql += " AND REPLACE(LOWER(veg_type), '-', '') = REPLACE(LOWER(?), '-', '')";
        values.push(veg_type.trim());
    }

    if (price_range && price_range !== "All" && price_range.trim() !== "") {
        sql += " AND price_range = ?";
        values.push(price_range.trim());
    }

    if (min_rating && min_rating !== "") {
        if (min_rating === "below4") {
            sql += " AND rating < ?";
            values.push(4);
        } else {
            sql += " AND rating >= ?";
            values.push(parseFloat(min_rating));
        }
    }

    // 🔥 SORT RESTAURANTS BY RATING (Highest First)
    sql += " ORDER BY rating DESC";

    console.log("Final SQL:", sql);
    console.log("Values:", values);

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error("Search Error:", err);
            return res.status(500).json({ error: "Search failed" });
        }
        res.json(results);
    });
});

// =====================================================
// ✅ GET LOCATIONS (Sorted by Highest Rated Location)
// =====================================================

app.get("/api/locations", (req, res) => {

    const search = req.query.search || "";

    const sql = `
        SELECT location, MAX(rating) as max_rating
        FROM restaurants
        WHERE LOWER(location) LIKE LOWER(?)
        GROUP BY location
        ORDER BY max_rating DESC
        LIMIT 10
    `;

    db.query(sql, [`%${search}%`], (err, results) => {
        if (err) {
            console.error("Location Fetch Error:", err);
            return res.status(500).json({ error: "Failed to fetch locations" });
        }

        res.json(results);
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000 🚀");
});
