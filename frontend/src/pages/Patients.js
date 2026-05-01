import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../Api/healthApi';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    patientApi.getAll().then(res => setPatients(res.data.data));
  }, []);

  const columns = [
    { field: 'patient_id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'age', headerName: 'Age', width: 80 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: () => (
        <Button size="small" variant="outlined">
          View Metrics
        </Button>
      )
    }
  ];

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        👥 Patients ({patients.length})
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => navigate('/add-patient')}
      >
        Add Patient
      </Button>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={patients} columns={columns} getRowId={(row) => row.patient_id} />
      </div>
    </div>
  );
};

export default Patients;