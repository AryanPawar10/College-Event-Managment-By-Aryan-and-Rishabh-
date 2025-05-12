const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error("❌ Missing environment variables. Check your .env file.");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Route Imports
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registration'); // ✅ Correct filename
const passwordRoutes = require('./routes/password');
const profileRoutes = require('./routes/profile');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes); // Mount the event routes
app.use('/api/registration', registrationRoutes); // Mount the registration routes
app.use('/api/password', passwordRoutes); // Mount the password routes
app.use('/api/profile', profileRoutes); // Mount the profile routes

// Root Endpoint
app.get('/', (req, res) => {
  res.send('✅ API is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});