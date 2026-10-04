const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room is required']
    },

    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
      minlength: [2, 'Guest name must contain at least 2 characters']
    },

    guestEmail: {
      type: String,
      required: [true, 'Guest email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email'
      ]
    },

    guestPhone: {
      type: String,
      required: [true, 'Guest phone is required'],
      trim: true
    },

    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required']
    },

    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required']
    },

    adults: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    children: {
      type: Number,
      min: 0,
      default: 0
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending'
    },

    bookingStatus: {
      type: String,
      enum: ['Confirmed', 'Cancelled', 'Completed'],
      default: 'Confirmed'
    },

    stayStatus: {
      type: String,
      enum: ['Upcoming', 'Checked-In', 'Checked-Out'],
      default: 'Upcoming'
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.pre('validate', function (next) {
  if (
    this.checkInDate &&
    this.checkOutDate &&
    this.checkOutDate <= this.checkInDate
  ) {
    return next(
      new Error('Check-out date must be after check-in date')
    );
  }

  next();
});

module.exports = mongoose.model('Booking', bookingSchema);