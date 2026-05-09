require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 3000;

// --- Helper Function: Haversine Formula ---
// Calculates the distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// --- API 1: Add a School ---
app.post('/addSchool', async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        // 1. Validation
        if (!name || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'All fields (name, address, latitude, longitude) are required.' });
        }

        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(400).json({ error: 'Latitude and longitude must be numbers.' });
        }

        // 2. Database Insertion
        const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(query, [name, address, latitude, longitude]);

        res.status(201).json({
            message: 'School added successfully!',
            schoolId: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- API 2: List Schools (Sorted by Proximity) ---
app.get('/listSchools', async (req, res) => {
    try {
        // Get user coordinates from query parameters (e.g., /listSchools?lat=23.5&lng=86.0)
        const userLat = parseFloat(req.query.lat);
        const userLng = parseFloat(req.query.lng);

        // 1. Validation
        if (isNaN(userLat) || isNaN(userLng)) {
            return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lng) are required as query parameters.' });
        }

        // 2. Fetch all schools from DB
        const [schools] = await db.execute('SELECT * FROM schools');

        // 3. Calculate distance for each school and attach it to the object
        const schoolsWithDistance = schools.map(school => {
            const distance = calculateDistance(userLat, userLng, school.latitude, school.longitude);
            return {
                ...school,
                distanceInKm: parseFloat(distance.toFixed(2)) // Round to 2 decimal places
            };
        });

        // 4. Sort schools by distance (ascending)
        schoolsWithDistance.sort((a, b) => a.distanceInKm - b.distanceInKm);

        // 5. Send response
        res.status(200).json(schoolsWithDistance);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});