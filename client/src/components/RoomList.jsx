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
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    room: null
  });

  const navigate = useNavigate();

  // Fetch rooms with filters
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};

      if (searchTerm) params.search = searchTerm;
      if (typeFilter) params.type = typeFilter;
      if (availabilityFilter) {
        params.availability = availabilityFilter;
      }
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

  // Handle delete
  const handleDelete = async (room) => {
    try {
      await roomAPI.deleteRoom(room._id);

      setSuccess(
        `Room ${room.roomNumber} deleted successfully`
      );

      fetchRooms();
    } catch (err) {
      setError(
        'Failed to delete room. Please try again.'
      );

      console.error('Error deleting room:', err);
    }

    setDeleteDialog({
      open: false,
      room: null
    });
  };

  // Handle availability toggle
  const handleAvailabilityToggle = async (room) => {
    try {
      await roomAPI.updateRoom(room._id, {
        availability: !room.availability
      });

      setSuccess(
        `Room ${room.roomNumber} availability updated`
      );

      fetchRooms();
    } catch (err) {
      setError(
        'Failed to update room availability. Please try again.'
      );

      console.error('Error updating room:', err);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setAvailabilityFilter('');
    setSortBy('');
  };

  // INR currency formatter
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (loading && rooms.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>

      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            letterSpacing: '-0.025em',
            mb: 1
          }}
        >
          Room Management
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: '1.1rem'
          }}
        >
          Manage your hotel rooms with ease. Add, edit,
          and track room availability.
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background:
            'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border:
            '1px solid rgba(226, 232, 240, 0.8)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor:
                'rgba(37, 99, 235, 0.1)',
              borderRadius: 2,
              px: 2,
              py: 1,
              mr: 2
            }}
          >
            <FilterIcon
              sx={{
                mr: 1,
                color: '#2563eb',
                fontSize: 20
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#1e293b'
            }}
          >
            Filters & Search
          </Typography>
        </Box>

        <Grid
          container
          spacing={2}
          alignItems="center"
        >

          {/* Search */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Rooms"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Room number or type..."
              InputProps={{
                startAdornment: (
                  <SearchIcon
                    sx={{
                      mr: 1,
                      color: 'text.secondary'
                    }}
                  />
                )
              }}
            />
          </Grid>

          {/* Room Type */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>
                Room Type
              </InputLabel>

              <Select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value)
                }
                label="Room Type"
              >
                <MenuItem value="">
                  All Types
                </MenuItem>

                <MenuItem value="Single">
                  Single
                </MenuItem>

                <MenuItem value="Double">
                  Double
                </MenuItem>

                <MenuItem value="Suite">
                  Suite
                </MenuItem>

                <MenuItem value="Deluxe">
                  Deluxe
                </MenuItem>

                <MenuItem value="Executive">
                  Executive
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Availability */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>
                Availability
              </InputLabel>

              <Select
                value={availabilityFilter}
                onChange={(e) =>
                  setAvailabilityFilter(e.target.value)
                }
                label="Availability"
              >
                <MenuItem value="">
                  All Rooms
                </MenuItem>

                <MenuItem value="true">
                  Available
                </MenuItem>

                <MenuItem value="false">
                  Occupied
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sort */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>
                Sort By
              </InputLabel>

              <Select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                label="Sort By"
              >
                <MenuItem value="">
                  Default
                </MenuItem>

                <MenuItem value="price_asc">
                  Price (Low to High)
                </MenuItem>

                <MenuItem value="price_desc">
                  Price (High to Low)
                </MenuItem>

                <MenuItem value="room_asc">
                  Room Number (A-Z)
                </MenuItem>

                <MenuItem value="room_desc">
                  Room Number (Z-A)
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Clear Filters */}
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
      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
      >

        {/* Total Rooms */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            sx={{
              height: '100%',
              background:
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardContent
              sx={{
                position: 'relative',
                zIndex: 1
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  mb: 1
                }}
              >
                Total Rooms
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700
                }}
              >
                {rooms.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Rooms */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            sx={{
              height: '100%',
              background:
                'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardContent
              sx={{
                position: 'relative',
                zIndex: 1
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  mb: 1
                }}
              >
                Available Rooms
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700
                }}
              >
                {
                  rooms.filter(
                    (room) => room.availability
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Occupied Rooms */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            sx={{
              height: '100%',
              background:
                'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardContent
              sx={{
                position: 'relative',
                zIndex: 1
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  mb: 1
                }}
              >
                Occupied Rooms
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700
                }}
              >
                {
                  rooms.filter(
                    (room) => !room.availability
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Price */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >
          <Card
            sx={{
              height: '100%',
              background:
                'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardContent
              sx={{
                position: 'relative',
                zIndex: 1
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  mb: 1
                }}
              >
                Average Price
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700
                }}
              >
                {rooms.length > 0
                  ? formatPrice(
                      rooms.reduce(
                        (sum, room) =>
                          sum + room.pricePerNight,
                        0
                      ) / rooms.length
                    )
                  : '₹0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Rooms Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        <Table>

          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#f8fafc'
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  py: 2
                }}
              >
                Room Number
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  py: 2
                }}
              >
                Type
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  py: 2
                }}
              >
                Price/Night
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  py: 2
                }}
              >
                Availability
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  py: 2
                }}
              >
                Amenities
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  py: 2
                }}
              >
                Description
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  fontWeight: 600,
                  color: '#374151',
                  py: 2
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rooms.map((room) => (
              <TableRow
                key={room._id}
                hover
                sx={{
                  '&:hover': {
                    backgroundColor:
                      'rgba(37, 99, 235, 0.04)',
                    transform: 'scale(1.01)',
                    transition:
                      'all 0.2s ease-in-out'
                  },

                  '&:nth-of-type(even)': {
                    backgroundColor:
                      'rgba(248, 250, 252, 0.5)'
                  },

                  borderBottom:
                    '1px solid #e2e8f0'
                }}
              >

                {/* Room Number */}
                <TableCell sx={{ py: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor:
                          'rgba(37, 99, 235, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="primary"
                      >
                        {room.roomNumber}
                      </Typography>
                    </Box>

                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      color="text.primary"
                    >
                      {room.roomNumber}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Type */}
                <TableCell sx={{ py: 2 }}>
                  <Chip
                    label={room.type}
                    sx={{
                      backgroundColor:
                        'rgba(37, 99, 235, 0.1)',
                      color: '#1d4ed8',
                      fontWeight: 500,
                      border:
                        '1px solid rgba(37, 99, 235, 0.2)'
                    }}
                    size="small"
                  />
                </TableCell>

                {/* Price */}
                <TableCell sx={{ py: 2 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="600"
                    color="text.primary"
                  >
                    {formatPrice(
                      room.pricePerNight
                    )}
                  </Typography>
                </TableCell>

                {/* Availability */}
                <TableCell sx={{ py: 2 }}>
                  <Chip
                    label={
                      room.availability
                        ? 'Available'
                        : 'Occupied'
                    }
                    sx={{
                      backgroundColor:
                        room.availability
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',

                      color:
                        room.availability
                          ? '#059669'
                          : '#dc2626',

                      fontWeight: 500,
                      cursor: 'pointer',

                      '&:hover': {
                        backgroundColor:
                          room.availability
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',

                        transform: 'scale(1.05)'
                      },

                      transition:
                        'all 0.2s ease-in-out'
                    }}
                    size="small"
                    onClick={() =>
                      handleAvailabilityToggle(room)
                    }
                  />
                </TableCell>

                {/* Amenities */}
                <TableCell sx={{ py: 2 }}>
                  {room.amenities &&
                  room.amenities.length > 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5
                      }}
                    >
                      {room.amenities
                        .slice(0, 2)
                        .map(
                          (amenity, index) => (
                            <Chip
                              key={index}
                              label={amenity}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize:
                                  '0.75rem',
                                height: 24,
                                backgroundColor:
                                  'rgba(124, 58, 237, 0.05)',
                                borderColor:
                                  'rgba(124, 58, 237, 0.2)',
                                color:
                                  '#6d28d9'
                              }}
                            />
                          )
                        )}

                      {room.amenities.length > 2 && (
                        <Chip
                          label={`+${
                            room.amenities.length - 2
                          }`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.75rem',
                            height: 24,
                            backgroundColor:
                              'rgba(100, 116, 139, 0.1)',
                            borderColor:
                              'rgba(100, 116, 139, 0.3)',
                            color: '#64748b'
                          }}
                        />
                      )}
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontStyle: 'italic'
                      }}
                    >
                      No amenities
                    </Typography>
                  )}
                </TableCell>

                {/* Description */}
                <TableCell sx={{ py: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.4
                    }}
                  >
                    {room.description ||
                      'No description'}
                  </Typography>
                </TableCell>

                {/* Actions */}
                <TableCell
                  align="center"
                  sx={{ py: 2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      justifyContent: 'center'
                    }}
                  >
                    <IconButton
                      component={Link}
                      to={`/edit/${room._id}`}
                      sx={{
                        backgroundColor:
                          'rgba(37, 99, 235, 0.1)',
                        color: '#2563eb',

                        '&:hover': {
                          backgroundColor:
                            'rgba(37, 99, 235, 0.2)',
                          transform: 'scale(1.1)'
                        },

                        transition:
                          'all 0.2s ease-in-out'
                      }}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          room
                        })
                      }
                      sx={{
                        backgroundColor:
                          'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',

                        '&:hover': {
                          backgroundColor:
                            'rgba(239, 68, 68, 0.2)',
                          transform: 'scale(1.1)'
                        },

                        transition:
                          'all 0.2s ease-in-out'
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>

        {rooms.length === 0 && !loading && (
          <Box
            p={4}
            textAlign="center"
          >
            <Typography
              variant="h6"
              color="textSecondary"
            >
              No rooms found
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
            >
              Try adjusting your filters or add a
              new room.
            </Typography>
          </Box>
        )}

      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() =>
          setDeleteDialog({
            open: false,
            room: null
          })
        }
      >
        <DialogTitle>
          Delete Room
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete room{' '}
            {deleteDialog.room?.roomNumber}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog({
                open: false,
                room: null
              })
            }
          >
            Cancel
          </Button>

          <Button
            onClick={() =>
              handleDelete(deleteDialog.room)
            }
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Message */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
        >
          {success}
        </Alert>
      </Snackbar>

      {/* Error Message */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
        >
          {error}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default RoomList;