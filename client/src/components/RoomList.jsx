import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  
  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, room: null });
  
  const navigate = useNavigate();

  // Fetch rooms with filters
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (typeFilter) params.type = typeFilter;
      if (availabilityFilter) params.availability = availabilityFilter;
      if (sortBy) params.sort = sortBy;
      
      const response = await roomAPI.getRooms(params);
      setRooms(response.data);
    } catch (err) {
      setError('Failed to fetch rooms. Please try again.');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [typeFilter, availabilityFilter, sortBy]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRooms();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (room) => {
    try {
      await roomAPI.deleteRoom(room._id);
      setSuccess(`Room ${room.roomNumber} deleted successfully`);
      fetchRooms(); // Refresh the list
    } catch (err) {
      setError('Failed to delete room. Please try again.');
      console.error('Error deleting room:', err);
    }
    setDeleteDialog({ open: false, room: null });
  };

  const handleAvailabilityToggle = async (room) => {
    try {
      await roomAPI.updateRoom(room._id, {
        availability: !room.availability
      });
      setSuccess(`Room ${room.roomNumber} availability updated`);
      fetchRooms();
    } catch (err) {
      setError('Failed to update room availability. Please try again.');
      console.error('Error updating room:', err);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setAvailabilityFilter('');
    setSortBy('');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading && rooms.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Room Management
      </Typography>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Filters & Search
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Rooms"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Room number or type..."
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Room Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Room Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Double">Double</MenuItem>
                <MenuItem value="Suite">Suite</MenuItem>
                <MenuItem value="Deluxe">Deluxe</MenuItem>
                <MenuItem value="Executive">Executive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Availability</InputLabel>
              <Select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                label="Availability"
              >
                <MenuItem value="">All Rooms</MenuItem>
                <MenuItem value="true">Available</MenuItem>
                <MenuItem value="false">Occupied</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="price_asc">Price (Low to High)</MenuItem>
                <MenuItem value="price_desc">Price (High to Low)</MenuItem>
                <MenuItem value="room_asc">Room Number (A-Z)</MenuItem>
                <MenuItem value="room_desc">Room Number (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              onClick={clearFilters}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Room Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Rooms
              </Typography>
              <Typography variant="h5">
                {rooms.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available Rooms
              </Typography>
              <Typography variant="h5" color="success.main">
                {rooms.filter(room => room.availability).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Occupied Rooms
              </Typography>
              <Typography variant="h5" color="error.main">
                {rooms.filter(room => !room.availability).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Price
              </Typography>
              <Typography variant="h5">
                {rooms.length > 0 
                  ? formatPrice(rooms.reduce((sum, room) => sum + room.pricePerNight, 0) / rooms.length)
                  : '$0'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rooms Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price/Night</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Amenities</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room._id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {room.roomNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={room.type} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {formatPrice(room.pricePerNight)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={room.availability ? 'Available' : 'Occupied'}
                    color={room.availability ? 'success' : 'error'}
                    size="small"
                    onClick={() => handleAvailabilityToggle(room)}
                    style={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell>
                  {room.amenities && room.amenities.length > 0 ? (
                    <Box>
                      {room.amenities.slice(0, 2).map((amenity, index) => (
                        <Chip
                          key={index}
                          label={amenity}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {room.amenities.length > 2 && (
                        <Chip
                          label={`+${room.amenities.length - 2}`}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No amenities
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ 
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {room.description || 'No description'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    component={Link}
                    to={`/edit/${room._id}`}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setDeleteDialog({ open: true, room })}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {rooms.length === 0 && !loading && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="textSecondary">
              No rooms found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your filters or add a new room.
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, room: null })}
      >
        <DialogTitle>Delete Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete room {deleteDialog.room?.roomNumber}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, room: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleDelete(deleteDialog.room)} 
            color="error" 
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default RoomList;
