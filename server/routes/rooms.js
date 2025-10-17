const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// GET /api/rooms - Get all rooms with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { type, availability, sort, search } = req.query;
    
    // Build filter object
    let filter = {};
    
    if (type) {
      filter.type = type;
    }
    
    if (availability !== undefined) {
      filter.availability = availability === 'true';
    }
    
    if (search) {
      filter.$or = [
        { roomNumber: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    let sortOption = { createdAt: -1 }; // Default sort by newest first
    
    if (sort) {
      if (sort === 'price_asc') {
        sortOption = { pricePerNight: 1 };
      } else if (sort === 'price_desc') {
        sortOption = { pricePerNight: -1 };
      } else if (sort === 'room_asc') {
        sortOption = { roomNumber: 1 };
      } else if (sort === 'room_desc') {
        sortOption = { roomNumber: -1 };
      }
    }
    
    const rooms = await Room.find(filter).sort(sortOption);
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Server error while fetching rooms' });
  }
});

// GET /api/rooms/:id - Get a specific room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid room ID' });
    }
    res.status(500).json({ message: 'Server error while fetching room' });
  }
});

// POST /api/rooms - Add a new room
router.post('/', async (req, res) => {
  try {
    const { roomNumber, type, pricePerNight, amenities, description } = req.body;
    
    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists' });
    }
    
    const room = new Room({
      roomNumber,
      type,
      pricePerNight,
      amenities: amenities || [],
      description
    });
    
    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error while creating room' });
  }
});

// PUT /api/rooms/:id - Update room details
router.put('/:id', async (req, res) => {
  try {
    const { roomNumber, type, pricePerNight, availability, amenities, description } = req.body;
    
    // Check if room number already exists (excluding current room)
    if (roomNumber) {
      const existingRoom = await Room.findOne({ 
        roomNumber, 
        _id: { $ne: req.params.id } 
      });
      if (existingRoom) {
        return res.status(400).json({ message: 'Room number already exists' });
      }
    }
    
    const updateData = {};
    if (roomNumber !== undefined) updateData.roomNumber = roomNumber;
    if (type !== undefined) updateData.type = type;
    if (pricePerNight !== undefined) updateData.pricePerNight = pricePerNight;
    if (availability !== undefined) updateData.availability = availability;
    if (amenities !== undefined) updateData.amenities = amenities;
    if (description !== undefined) updateData.description = description;
    
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid room ID' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error while updating room' });
  }
});

// DELETE /api/rooms/:id - Delete a room
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json({ message: 'Room deleted successfully', room });
  } catch (error) {
    console.error('Error deleting room:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid room ID' });
    }
    
    res.status(500).json({ message: 'Server error while deleting room' });
  }
});

module.exports = router;
