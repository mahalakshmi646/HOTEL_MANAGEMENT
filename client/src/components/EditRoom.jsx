import React, { useState, useEffect } from 'react';
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
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
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

const EditRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Form state
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    pricePerNight: '',
    availability: true,
    amenities: [],
    description: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setFetching(true);
        setError(null);
        const response = await roomAPI.getRoom(id);
        const room = response.data;
        
        setFormData({
          roomNumber: room.roomNumber || '',
          type: room.type || '',
          pricePerNight: room.pricePerNight || '',
          availability: room.availability !== undefined ? room.availability : true,
          amenities: room.amenities || [],
          description: room.description || ''
        });
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('Failed to load room data. Please try again.');
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id]);

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

  const handleSwitchChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
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
      
      await roomAPI.updateRoom(id, roomData);
      setSuccess('Room updated successfully!');
      
      // Navigate back to room list after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      console.error('Error updating room:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError('Failed to update room. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading room data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Room
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.availability}
                      onChange={handleSwitchChange('availability')}
                      disabled={loading}
                      color="success"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">
                        {formData.availability ? 'Available' : 'Occupied'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Toggle room availability status
                      </Typography>
                    </Box>
                  }
                />
              </FormControl>
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
              {loading ? 'Updating Room...' : 'Update Room'}
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

export default EditRoom;
