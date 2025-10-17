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
    <Box sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: '#1e293b',
            letterSpacing: '-0.025em',
            mb: 2
          }}
        >
          Add New Room
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}
        >
          Create a new room entry with all the necessary details including amenities and pricing.
        </Typography>
      </Box>
      
      <Paper 
        sx={{ 
          p: 4, 
          maxWidth: 900, 
          mx: 'auto',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
      >
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
          
          <Box sx={{ 
            mt: 5, 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            pt: 3,
            borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              size="large"
              sx={{
                minWidth: 140,
                py: 1.5,
                borderRadius: 2,
                borderColor: '#cbd5e1',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: 'rgba(100, 116, 139, 0.04)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
              sx={{
                minWidth: 140,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: '#cbd5e1',
                  color: '#94a3b8',
                },
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
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
