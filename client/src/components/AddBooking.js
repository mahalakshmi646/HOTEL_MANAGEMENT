import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';

const API_URL = 'http://localhost:5001/api';

function AddBooking() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    room: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    notes: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/rooms`);

      const availableRooms = response.data.filter(
        (room) => room.availability === true
      );

      setRooms(availableRooms);
    } catch (err) {
      console.error(err);
      setError('Unable to load available rooms.');
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setError('');
    setSuccess('');
  };

  const selectedRoom = rooms.find(
    (room) => room._id === formData.room
  );

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      return 0;
    }

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);

    const difference = checkOut - checkIn;

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  const nights = calculateNights();

  const totalAmount =
    selectedRoom && nights > 0
      ? selectedRoom.pricePerNight * nights
      : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!formData.room) {
      setError('Please select a room.');
      return;
    }

    if (!formData.guestName.trim()) {
      setError('Please enter guest name.');
      return;
    }

    if (!formData.guestEmail.trim()) {
      setError('Please enter guest email.');
      return;
    }

    if (!formData.guestPhone.trim()) {
      setError('Please enter guest phone.');
      return;
    }

    if (!formData.checkInDate || !formData.checkOutDate) {
      setError('Please select check-in and check-out dates.');
      return;
    }

    if (nights <= 0) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        `${API_URL}/bookings`,
        formData
      );

      if (response.status === 201) {
        setSuccess('Booking created successfully!');

        setTimeout(() => {
          navigate('/bookings');
        }, 1000);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        'Unable to create booking.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRooms) {
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Create New Booking
        </Typography>

        <Typography color="text.secondary">
          Add a new guest reservation
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
        >
          {success}
        </Alert>
      )}

      {rooms.length === 0 ? (
        <Alert severity="warning">
          No available rooms found. Please add or free a room first.
        </Alert>
      ) : (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <Grid container spacing={3}>

                {/* Room */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Select Room"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    required
                  >
                    {rooms.map((room) => (
                      <MenuItem
                        key={room._id}
                        value={room._id}
                      >
                        Room {room.roomNumber} - {room.type} - ₹
                        {room.pricePerNight}/night
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Guest Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Guest Name"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Guest Email"
                    type="email"
                    name="guestEmail"
                    value={formData.guestEmail}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                {/* Phone */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Guest Phone"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                {/* Adults */}
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Adults"
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5, 6].map((number) => (
                      <MenuItem
                        key={number}
                        value={number}
                      >
                        {number}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Children */}
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Children"
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                  >
                    {[0, 1, 2, 3, 4, 5].map((number) => (
                      <MenuItem
                        key={number}
                        value={number}
                      >
                        {number}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Check-in */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-in Date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      min: new Date()
                        .toISOString()
                        .split('T')[0]
                    }}
                    required
                  />
                </Grid>

                {/* Check-out */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-out Date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      min: formData.checkInDate ||
                        new Date()
                          .toISOString()
                          .split('T')[0]
                    }}
                    required
                  />
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional guest requirements..."
                  />
                </Grid>

                {/* Booking Summary */}
                <Grid item xs={12}>
                  <Card
                    sx={{
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        gutterBottom
                      >
                        Booking Summary
                      </Typography>

                      <Typography>
                        Room:{' '}
                        {selectedRoom
                          ? `${selectedRoom.roomNumber} - ${selectedRoom.type}`
                          : 'Not selected'}
                      </Typography>

                      <Typography>
                        Price per night:{' '}
                        {selectedRoom
                          ? `₹${selectedRoom.pricePerNight}`
                          : '₹0'}
                      </Typography>

                      <Typography>
                        Nights: {nights}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{ mt: 1 }}
                      >
                        Total Amount: ₹{totalAmount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Buttons */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                    >
                      {submitting
                        ? 'Creating...'
                        : 'Create Booking'}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => navigate('/bookings')}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>

              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default AddBooking;