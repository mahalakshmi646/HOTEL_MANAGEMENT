const express = require('express');
const router = express.Router();

const Room = require('../models/Room');
const Booking = require('../models/Booking');

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    // Room statistics
    const totalRooms = await Room.countDocuments();

    const availableRooms = await Room.countDocuments({
      availability: true
    });

    const occupiedRooms = await Room.countDocuments({
      availability: false
    });

    // Booking statistics
    const totalBookings = await Booking.countDocuments();

    const confirmedBookings = await Booking.countDocuments({
      bookingStatus: 'Confirmed'
    });

    const completedBookings = await Booking.countDocuments({
      bookingStatus: 'Completed'
    });

    const cancelledBookings = await Booking.countDocuments({
      bookingStatus: 'Cancelled'
    });

    // Payment statistics
    const paidBookings = await Booking.countDocuments({
      paymentStatus: 'Paid'
    });

    const pendingPayments = await Booking.countDocuments({
      paymentStatus: 'Pending'
    });

    // Revenue from paid bookings only
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'Paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: '$totalAmount'
          }
        }
      }
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // Average room price
    const priceResult = await Room.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: {
            $avg: '$pricePerNight'
          }
        }
      }
    ]);

    const averageRoomPrice =
      priceResult.length > 0
        ? Number(priceResult[0].averagePrice.toFixed(2))
        : 0;

    res.json({
      rooms: {
        total: totalRooms,
        available: availableRooms,
        occupied: occupiedRooms,
        averagePrice: averageRoomPrice
      },

      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings
      },

      payments: {
        paid: paidBookings,
        pending: pendingPayments,
        totalRevenue
      }
    });

  } catch (error) {
    console.error('Reports error:', error);

    res.status(500).json({
      message: 'Unable to generate reports'
    });
  }
});

module.exports = router;