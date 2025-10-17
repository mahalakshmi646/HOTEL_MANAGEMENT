import React from 'react';
import {
  Box,
  Typography,
  Container,
  Divider
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: '#1e293b',
        color: 'white',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(37, 99, 235, 0.5) 50%, transparent 100%)',
        }
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <HotelIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.025em',
            }}
          >
            Hotel Management System
          </Typography>
        </Box>
        
        <Divider 
          sx={{ 
            borderColor: 'rgba(148, 163, 184, 0.3)',
            mb: 2,
          }} 
        />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(148, 163, 184, 0.8)',
              fontSize: '0.875rem',
            }}
          >
            © 2025 Hotel Management System. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(148, 163, 184, 0.6)',
              fontSize: '0.75rem',
              mt: 1,
            }}
          >
            
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
