import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import listingRoutes from './routes/listings.js';
import messageRoutes from './routes/messages.js';
import Message from './models/Message.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
// İzin verilen origin'leri environment variable'dan al
const allowedOrigins = process.env.ALLOWED_ORIGINS
// Socket.IO CORS Ayarları
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

const __dirname = path.resolve();


// Middleware
// CORS Ayarları

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));;

app.use(express.json());

// Serve uploaded files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);

  socket.on('sendMessage', async (messageData) => {
    try {
      const message = new Message({
        sender: socket.userId,
        receiver: messageData.receiver,
        listing: messageData.listing,
        content: messageData.content
      });

      const savedMessage = await message.save();
      const populatedMessage = await Message.findById(savedMessage._id)
        .populate('sender', 'name avatar')
        .populate('receiver', 'name avatar');

      io.emit('newMessage', populatedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/messages', messageRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

  /*  // Serve static files from the dist folder
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Redirect all non-API routes to React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, "dist", 'index.html'));
});
*/
app.use(express.static(path.join(__dirname, "/dist")));
  console.log(__dirname);
  app.get("*",(req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
})


const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});