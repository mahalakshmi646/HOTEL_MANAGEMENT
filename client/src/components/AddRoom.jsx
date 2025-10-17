import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  OutlinedInput,
  Alert,
  CircularProgress,
  Snackbar,
  Grid,
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const availableAmenities = [
  'WiFi',
  'Air Conditioning',
  'TV',
  'Mini Bar',
  'Room Service',
  'Balcony',
  'Ocean View',
  'City View',
  'Jacuzzi',
  'Kitchenette',
  'Safe',
  'Hair Dryer',
  'Coffee Machine',
  'Iron',
  'Work Desk',
  'Sofa',
  'Refrigerator'
];

const roomTypes = ['Single', 'Double', 'Suite', 'Deluxe', 'Executive'];

const AddRoom = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    pricePerNight: '',
    amenities: [],
    description: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAmenitiesChange = (event) => {
    const value = typeof event.target.value === 'string' 
      ? event.target.value.split(',') 
      : event.target.value;
    
    setFormData(prev => ({
      ...prev,
      amenities: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.roomNumber.trim()) {
      errors.roomNumber = 'Room number is required';
    } else if (!/^[A-Z0-9-]+$/i.test(formData.roomNumber)) {
      errors.roomNumber = 'Room number should contain only letters, numbers, and hyphens';
    }
    
    if (!formData.type) {
      errors.type = 'Room type is required';
    }
    
    if (!formData.pricePerNight || formData.pricePerNight <= 0) {
      errors.pricePerNight = 'Valid price per night is required';
    } else if (formData.pricePerNight > 10000) {
      errors.pricePerNight = 'Price seems too high (max $10,000)';
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const roomData = {
        ...formData,
        pricePerNight: parseFloat(formData.pricePerNight),
        roomNumber: formData.roomNumber.trim().toUpperCase()
      };
      
      await roomAPI.createRoom(roomData);
      setSuccess('Room added successfully!');
      
      // Reset form
      setFormData({
        roomNumber: '',
        type: '',
        pricePerNight: '',
        amenities: [],
        description: ''
      });
      
      // Navigate back to room list after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      console.error('Error creating room:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError('Failed to add room. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Room
      </Typography>
      
      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Room Number"
                value={formData.roomNumber}
                onChange={handleInputChange('roomNumber')}
                placeholder="e.g., 101, A-205, SUITE-1"
                error={!!validationErrors.roomNumber}
                helperText={validationErrors.roomNumber}
                required
                disabled={loading}
                inputProps={{
                  style: { textTransform: 'uppercase' }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!validationErrors.type}>
                <InputLabel>Room Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={handleInputChange('type')}
                  label="Room Type"
                  disabled={loading}
                >
                  {roomTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.type && (
                  <FormHelperText>{validationErrors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price per Night"
                type="number"
                value={formData.pricePerNight}
                onChange={handleInputChange('pricePerNight')}
                placeholder="0.00"
                error={!!validationErrors.pricePerNight}
                helperText={validationErrors.pricePerNight}
                required
                disabled={loading}
                inputProps={{
                  min: 0,
                  max: 10000,
                  step: 0.01
                }}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Amenities</InputLabel>
                <Select
                  multiple
                  value={formData.amenities}
                  onChange={handleAmenitiesChange}
                  input={<OutlinedInput label="Amenities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                  disabled={loading}
                >
                  {availableAmenities.map((amenity) => (
                    <MenuItem key={amenity} value={amenity}>
                      {amenity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange('description')}
                placeholder="Enter room description, features, or special notes..."
                error={!!validationErrors.description}
                helperText={
                  validationErrors.description || 
                  `${formData.description.length}/500 characters`
                }
                disabled={loading}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              size="large"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Adding Room...' : 'Add Room'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Success/Error Messages */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddRoom;
