import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HotelIcon from '@mui/icons-material/Hotel';

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <HotelIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Hotel Booking Management
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ 
              mr: 2,
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            All Rooms
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/add"
            sx={{
              backgroundColor: location.pathname === '/add' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Add Room
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
