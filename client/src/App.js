import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoomList from './components/RoomList';
import AddRoom from './components/AddRoom';
import EditRoom from './components/EditRoom';

function App() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<RoomList />} />
            <Route path="/add" element={<AddRoom />} />
            <Route path="/edit/:id" element={<EditRoom />} />
          </Routes>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
