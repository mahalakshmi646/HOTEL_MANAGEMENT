import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HotelIcon from '@mui/icons-material/Hotel';
import RoomIcon from '@mui/icons-material/Room';
import AddIcon from '@mui/icons-material/Add';

const Navbar = () => {
  const location = useLocation();

  const navButtonStyles = {
    borderRadius: 8,
    px: 3,
    py: 1,
    mx: 0.5,
    fontWeight: 500,
    textTransform: 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(37, 99, 235, 0.08)',
      transform: 'translateY(-1px)',
    },
  };

  const activeNavButtonStyles = {
    ...navButtonStyles,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    color: '#1d4ed8',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'rgba(37, 99, 235, 0.16)',
    },
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: '#1e293b',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0, py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderRadius: 12,
                px: 2,
                py: 1,
                mr: 3,
              }}
            >
              <HotelIcon sx={{ mr: 1, color: '#2563eb', fontSize: 28 }} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '1.1rem',
                  letterSpacing: '-0.025em',
                }}
              >
                Hotel Management
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              component={Link}
              to="/"
              startIcon={<RoomIcon sx={{ fontSize: 20 }} />}
              sx={location.pathname === '/' ? activeNavButtonStyles : navButtonStyles}
            >
              All Rooms
            </Button>
            <Button
              component={Link}
              to="/add"
              startIcon={<AddIcon sx={{ fontSize: 20 }} />}
              sx={location.pathname === '/add' ? activeNavButtonStyles : navButtonStyles}
            >
              Add Room
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
