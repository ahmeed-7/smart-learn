require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const taskRoutes = require('./routes/taskRoutes');
const examRoutes = require('./routes/examRoutes');
const plannerRoutes = require('./routes/plannerRoutes');
const weekendRoutes = require('./routes/weekendRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/weekend', weekendRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Student Assistant API is Running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});