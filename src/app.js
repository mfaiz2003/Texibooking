const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json()); // To parse JSON requests

// Define schemas and models
const UserSchema = new mongoose.Schema({
  fullname: String,
  contactno: String,
  password: String
});

const RideSchema = new mongoose.Schema({
  userId: String,
  pickup: String,
  drop: String,
  time: String,
  date: String,
  fare: Number,
  cabType: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Ride = mongoose.model('Ride', RideSchema);

// Define the allowed routes and fares
const allowedRoutes = [
  
];

// Helper function to normalize location names
function normalizePlace(place) {
  return place.toLowerCase().trim();
}

// Database connection
console.log("Connecting to Mongo URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {

})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { fullname, contactno, password } = req.body;

    const existingUser = await User.findOne({ contactno });
    if (existingUser) {
      return res.status(400).send("Contact number already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ fullname, contactno, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(201).send({ message: "User created successfully", user: savedUser });
  } catch (error) {
    res.status(500).send({ error: "Error creating user" });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { contactno, password } = req.body;

    const user = await User.findOne({ contactno });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid password");
    }

    res.status(200).send({ message: "Login successful", user });
  } catch (error) {
    res.status(500).send({ error: "Error logging in" });
  }
});

// POST route for saving a new ride
app.post('/api/rides', async (req, res) => {
  const { userId, pickup, drop, time, date, cabType } = req.body;

  if (!userId || !pickup || !drop || !time || !date || !cabType) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    console.log("Incoming ride request:", req.body);
  
    // Normalize pickup and drop locations
    const userPickup = normalizePlace(pickup);
    const userDrop = normalizePlace(drop);

    // Find the matching route based on pickup and drop
    const matchedRoute = allowedRoutes.find(route =>
      normalizePlace(route.pickup) === userPickup &&
      normalizePlace(route.drop) === userDrop
    );

    if (!matchedRoute) {
      return res.status(400).json({ error: 'No service available for this route' });
    }

    // Get the fare for the selected cab type
    const fare = matchedRoute.price[cabType.toLowerCase()];
    if (!fare) {
      return res.status(400).json({ error: 'Invalid cab type for this route' });
    }

    // Save the ride data in the database
    const ride = new Ride({ userId, pickup, drop, time, date, fare, cabType });
    await ride.save();
    
    res.status(200).json({ message: 'Ride saved', rideId: ride._id });
  } catch (err) {
    console.error('Error booking ride:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET route to fetch rides for a specific user
app.get('/api/rides/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching rides for userId:", userId);

    const rides = await Ride.find({ userId });
    res.status(200).json({ rides });
  } catch (err) {
    console.error('Error in GET /api/rides/:userId:', err);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

// Export the app for testing or importing in other files
module.exports = app;