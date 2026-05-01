import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Alert, CircularProgress, Button } from '@mui/material';
import { patientApi } from '../Api/healthApi';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ patients: 0, highRisk: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const patients = await patientApi.getAll();
      const highRisk = await patientApi.highRisk();

      setStats({
        patients: patients.data.data.length,
        highRisk: highRisk.data.data.length
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h3" gutterBottom>📊 Dashboard</Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4">{stats.patients}</Typography>
              <Typography>Total Patients</Typography>
              <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/patients')}>
                View Patients
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography variant="h4" color="error">{stats.highRisk}</Typography>
              <Typography>High Risk Patients</Typography>
              <Button sx={{ mt: 2 }} variant="contained" color="error" onClick={() => navigate('/high-risk')}>
                View High Risk
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Add New Patient</Typography>
              <Button sx={{ mt: 2 }} variant="contained" color="success" onClick={() => navigate('/add-patient')}>
                Add Patient
              </Button>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Alert severity="info" sx={{ mt: 2 }}>
        ✅ Manage patients, track risks, and monitor alerts
      </Alert>
    </div>
  );
};

export default Dashboard;