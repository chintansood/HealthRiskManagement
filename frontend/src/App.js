import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';
import HighRisk from './pages/HighRisk';

function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Health Risk System</Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/patients">Patients</Button>
          <Button color="inherit" component={Link} to="/add-patient">Add Patient</Button>
          <Button color="inherit" component={Link} to="/high-risk">High Risk</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/high-risk" element={<HighRisk />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;