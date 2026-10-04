import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
  Alert,
  Divider
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_URL}/bookings`);

      setBookings(response.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCheckIn = async (id) => {
    try {
      await axios.put(`${API_URL}/bookings/${id}/check-in`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await axios.put(`${API_URL}/bookings/${id}/check-out`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed');
    }
  };

  const handlePayment = async (id) => {
    try {
      await axios.put(`${API_URL}/bookings/${id}/payment`, {
        paymentStatus: 'Paid'
      });

      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment update failed');
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`${API_URL}/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 8
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Bookings
          </Typography>

          <Typography color="text.secondary">
            Manage hotel reservations and guest stays
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={fetchBookings}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Card>
          <CardContent>
            <Typography align="center" color="text.secondary">
              No bookings found.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking._id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {booking.guestName}
                    </Typography>

                    <Chip
                      label={booking.bookingStatus}
                      color={
                        booking.bookingStatus === 'Confirmed'
                          ? 'primary'
                          : booking.bookingStatus === 'Completed'
                          ? 'success'
                          : 'error'
                      }
                    />
                  </Box>

                  <Typography>
                    <strong>Room:</strong>{' '}
                    {booking.room?.roomNumber || 'N/A'}
                  </Typography>

                  <Typography>
                    <strong>Room Type:</strong>{' '}
                    {booking.room?.type || 'N/A'}
                  </Typography>

                  <Typography>
                    <strong>Email:</strong> {booking.guestEmail}
                  </Typography>

                  <Typography>
                    <strong>Phone:</strong> {booking.guestPhone}
                  </Typography>

                  <Typography>
                    <strong>Check-in:</strong>{' '}
                    {new Date(
                      booking.checkInDate
                    ).toLocaleDateString()}
                  </Typography>

                  <Typography>
                    <strong>Check-out:</strong>{' '}
                    {new Date(
                      booking.checkOutDate
                    ).toLocaleDateString()}
                  </Typography>

                  <Typography>
                    <strong>Guests:</strong>{' '}
                    {booking.adults} Adults, {booking.children} Children
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
                    <strong>Total:</strong> ₹
                    {booking.totalAmount}
                  </Typography>

                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Chip
                      label={`Stay: ${booking.stayStatus}`}
                      color={
                        booking.stayStatus === 'Checked-In'
                          ? 'warning'
                          : booking.stayStatus === 'Checked-Out'
                          ? 'success'
                          : 'default'
                      }
                      sx={{ mr: 1 }}
                    />

                    <Chip
                      label={`Payment: ${booking.paymentStatus}`}
                      color={
                        booking.paymentStatus === 'Paid'
                          ? 'success'
                          : 'warning'
                      }
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'wrap'
                    }}
                  >
                    {booking.stayStatus === 'Upcoming' &&
                      booking.bookingStatus === 'Confirmed' && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleCheckIn(booking._id)
                          }
                        >
                          Check In
                        </Button>
                      )}

                    {booking.stayStatus === 'Checked-In' && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          handleCheckOut(booking._id)
                        }
                      >
                        Check Out
                      </Button>
                    )}

                    {booking.paymentStatus !== 'Paid' &&
                      booking.bookingStatus !== 'Cancelled' && (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() =>
                            handlePayment(booking._id)
                          }
                        >
                          Mark Paid
                        </Button>
                      )}

                    {booking.bookingStatus === 'Confirmed' &&
                      booking.stayStatus === 'Upcoming' && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            handleCancel(booking._id)
                          }
                        >
                          Cancel
                        </Button>
                      )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default BookingList;