const express = require('express');
const router = express.Router();

const Booking = require('../models/Booking');
const Room = require('../models/Room');

// GET /api/bookings
// Get all bookings
router.get('/', async (req, res) => {
  try {
    const { status, paymentStatus, stayStatus } = req.query;

    const filter = {};

    if (status) {
      filter.bookingStatus = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (stayStatus) {
      filter.stayStatus = stayStatus;
    }

    const bookings = await Booking.find(filter)
      .populate('room')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);

    res.status(500).json({
      message: 'Server error while fetching bookings'
    });
  }
});


// GET /api/bookings/:id
// Get one booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room');

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid booking ID'
      });
    }

    res.status(500).json({
      message: 'Server error while fetching booking'
    });
  }
});


// POST /api/bookings
// Create booking
router.post('/', async (req, res) => {
  try {
    const {
      room,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      adults,
      children,
      notes
    } = req.body;

    // Check room
    const roomData = await Room.findById(room);

    if (!roomData) {
      return res.status(404).json({
        message: 'Room not found'
      });
    }

    // Check date validity
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res.status(400).json({
        message: 'Check-out date must be after check-in date'
      });
    }

    // Prevent double booking
    const overlappingBooking = await Booking.findOne({
      room,
      bookingStatus: 'Confirmed',
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn }
        }
      ]
    });

    if (overlappingBooking) {
      return res.status(409).json({
        message: 'Room is already booked for the selected dates'
      });
    }

    // Calculate number of nights
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil(
      (checkOut - checkIn) / millisecondsPerDay
    );

    const totalAmount =
      nights * roomData.pricePerNight;

    const booking = new Booking({
      room,
      guestName,
      guestEmail,
      guestPhone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults: adults || 1,
      children: children || 0,
      totalAmount,
      notes
    });

    const savedBooking = await booking.save();

    const populatedBooking =
      await Booking.findById(savedBooking._id)
        .populate('room');

    res.status(201).json(populatedBooking);

  } catch (error) {
    console.error('Error creating booking:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors)
        .map(err => err.message);

      return res.status(400).json({
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      message: 'Server error while creating booking'
    });
  }
});


// PUT /api/bookings/:id/check-in
// Check guest in
router.put('/:id/check-in', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    if (booking.bookingStatus !== 'Confirmed') {
      return res.status(400).json({
        message: 'Only confirmed bookings can be checked in'
      });
    }

    booking.stayStatus = 'Checked-In';

    await booking.save();

    await Room.findByIdAndUpdate(
      booking.room,
      { availability: false }
    );

    const updatedBooking =
      await Booking.findById(booking._id)
        .populate('room');

    res.json(updatedBooking);

  } catch (error) {
    console.error('Check-in error:', error);

    res.status(500).json({
      message: 'Server error during check-in'
    });
  }
});


// PUT /api/bookings/:id/check-out
// Check guest out
router.put('/:id/check-out', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    if (booking.stayStatus !== 'Checked-In') {
      return res.status(400).json({
        message: 'Guest must be checked in before check-out'
      });
    }

    booking.stayStatus = 'Checked-Out';
    booking.bookingStatus = 'Completed';

    await booking.save();

    await Room.findByIdAndUpdate(
      booking.room,
      { availability: true }
    );

    const updatedBooking =
      await Booking.findById(booking._id)
        .populate('room');

    res.json(updatedBooking);

  } catch (error) {
    console.error('Check-out error:', error);

    res.status(500).json({
      message: 'Server error during check-out'
    });
  }
});


// PUT /api/bookings/:id/payment
// Update payment status
router.put('/:id/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!['Pending', 'Paid', 'Refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        message: 'Invalid payment status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('room');

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    res.json(booking);

  } catch (error) {
    console.error('Payment update error:', error);

    res.status(500).json({
      message: 'Server error while updating payment'
    });
  }
});


// PUT /api/bookings/:id/cancel
// Cancel booking
router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    if (booking.stayStatus === 'Checked-In') {
      return res.status(400).json({
        message: 'Checked-in booking cannot be cancelled'
      });
    }

    booking.bookingStatus = 'Cancelled';

    await booking.save();

    const updatedBooking =
      await Booking.findById(booking._id)
        .populate('room');

    res.json(updatedBooking);

  } catch (error) {
    console.error('Cancel booking error:', error);

    res.status(500).json({
      message: 'Server error while cancelling booking'
    });
  }
});


module.exports = router;