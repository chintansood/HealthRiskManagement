import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Alert } from '@mui/material';
import { patientApi } from '../Api/healthApi';

const HighRisk = () => {
  const [highRisk, setHighRisk] = useState([]);

  useEffect(() => {
    patientApi.highRisk().then(res => setHighRisk(res.data.data));
  }, []);

  const columns = [
    { field: 'name', headerName: 'Patient', width: 200 },
    { field: 'age', headerName: 'Age', width: 100 },
    { field: 'score', headerName: 'Risk Score', width: 120 },
    { field: 'risk_level', headerName: 'Level', width: 120 }
  ];

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        🚨 High Risk Patients
      </Typography>

      {highRisk.length === 0 ? (
        <Alert severity="info">No high risk patients yet</Alert>
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={highRisk} columns={columns} getRowId={(row) => row.name} />
        </div>
      )}
    </div>
  );
};

export default HighRisk;