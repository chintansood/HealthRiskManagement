import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { patientApi } from '../Api/healthApi';
import { useNavigate } from 'react-router-dom';

const AddPatient = () => {
  const [formData, setFormData] = useState({ name: '', age: '', gender: 'Male', contact: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await patientApi.create(formData);
      setSuccess(true);
      setTimeout(() => navigate('/patients'), 1500);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Add Patient</Typography>

      {success && <Alert severity="success">Patient Added!</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth label="Name" value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required sx={{ mb: 2 }} />

        <TextField fullWidth label="Age" type="number"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          sx={{ mb: 2 }} />

        <TextField fullWidth label="Contact"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          required sx={{ mb: 2 }} />

        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          {loading ? 'Adding...' : 'Add Patient'}
        </Button>
      </Box>
    </Container>
  );
};

export default AddPatient;