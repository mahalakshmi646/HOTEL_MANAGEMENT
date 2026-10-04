import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography
} from '@mui/material';

import BedIcon from '@mui/icons-material/Bed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

function Navbar() {
  const location = useLocation();

  const isRoomsPage = location.pathname === '/';
  const isBookingsPage = location.pathname.startsWith('/bookings');

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <Toolbar
        sx={{
          minHeight: '72px !important',
          px: {
            xs: 2,
            md: 4
          },
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >

        {/* Logo */}
        <Button
          component={Link}
          to="/"
          sx={{
            textTransform: 'none',
            color: '#1e293b',
            backgroundColor: '#eef4ff',
            borderRadius: '30px',
            px: 2,
            py: 1,
            '&:hover': {
              backgroundColor: '#e0ebff'
            }
          }}
        >
          <BedIcon
            sx={{
              color: '#2563eb',
              fontSize: 30,
              mr: 1
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700
            }}
          >
            Hotel Management
          </Typography>
        </Button>

        {/* Navigation */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >

          {/* All Rooms */}
          <Button
            component={Link}
            to="/"
            startIcon={<LocationOnIcon />}
            sx={{
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              color: '#2563eb',
              borderRadius: '28px',
              px: 2.5,
              py: 1.2,
              backgroundColor: isRoomsPage
                ? '#eef4ff'
                : 'transparent',
              '&:hover': {
                backgroundColor: '#eef4ff'
              }
            }}
          >
            All Rooms
          </Button>

          {/* Bookings */}
          <Button
            component={Link}
            to="/bookings"
            startIcon={<BookOnlineIcon />}
            sx={{
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              color: '#2563eb',
              borderRadius: '28px',
              px: 2.5,
              py: 1.2,
              backgroundColor: isBookingsPage
                ? '#eef4ff'
                : 'transparent',
              '&:hover': {
                backgroundColor: '#eef4ff'
              }
            }}
          >
            Bookings
          </Button>

          {/* Add Room */}
          <Button
            component={Link}
            to="/add"
            startIcon={<AddIcon />}
            sx={{
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              color: '#2563eb',
              borderRadius: '28px',
              px: 2.5,
              py: 1.2,
              '&:hover': {
                backgroundColor: '#eef4ff'
              }
            }}
          >
            Add Room
          </Button>

          {/* New Booking */}
          <Button
            component={Link}
            to="/bookings/add"
            startIcon={<AddIcon />}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#2563eb',
              borderRadius: '28px',
              px: 2.5,
              py: 1.2,
              '&:hover': {
                backgroundColor: '#1d4ed8'
              }
            }}
          >
            New Booking
          </Button>

        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;