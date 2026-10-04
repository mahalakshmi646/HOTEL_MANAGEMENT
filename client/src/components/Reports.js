import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Button
} from '@mui/material';

const API_URL = 'http://localhost:5001/api';

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_URL}/reports`);

      setReport(response.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 8
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Reports & Analytics
          </Typography>

          <Typography color="text.secondary">
            Hotel performance overview
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={fetchReport}
        >
          Refresh
        </Button>
      </Box>

      {/* Room Statistics */}
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Room Statistics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Rooms
              </Typography>

              <Typography variant="h4" fontWeight={700}>
                {report.rooms.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Available Rooms
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="success.main"
              >
                {report.rooms.available}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Occupied Rooms
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="error.main"
              >
                {report.rooms.occupied}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Average Room Price
              </Typography>

              <Typography variant="h4" fontWeight={700}>
                ₹{report.rooms.averagePrice}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Booking Statistics */}
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Booking Statistics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Bookings
              </Typography>

              <Typography variant="h4" fontWeight={700}>
                {report.bookings.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Confirmed
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
              >
                {report.bookings.confirmed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Completed
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="success.main"
              >
                {report.bookings.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Cancelled
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="error.main"
              >
                {report.bookings.cancelled}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Statistics */}
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Payment Statistics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Paid Bookings
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="success.main"
              >
                {report.payments.paid}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Pending Payments
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="warning.main"
              >
                {report.payments.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Revenue
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
              >
                ₹{report.payments.totalRevenue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;