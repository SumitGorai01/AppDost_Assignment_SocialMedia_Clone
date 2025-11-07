require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Define allowed origins clearly
const allowedOrigins = [
  'http://localhost:5173', // for local development
  'https://linksphere-connect.vercel.app' // your deployed frontend
];

// ✅ Single CORS setup (no duplicates)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// ✅ Root route
app.get('/', (req, res) => res.send('LinkedIn Clone API is running 🚀'));

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
