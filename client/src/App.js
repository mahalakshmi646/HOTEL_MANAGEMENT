import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import RoomList from './components/RoomList';
import AddRoom from './components/AddRoom';
import EditRoom from './components/EditRoom';

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<RoomList />} />
          <Route path="/add" element={<AddRoom />} />
          <Route path="/edit/:id" element={<EditRoom />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
