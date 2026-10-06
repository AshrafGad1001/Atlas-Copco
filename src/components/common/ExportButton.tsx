"use client";
import React, { useState } from 'react';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { handleExport } from '@/lib/exportHelper';

export default function ExportButton({ url, testId = "export-csv-btn", label = "تصدير" }: { url: string, testId?: string, label?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onClick = async () => {
    setLoading(true);
    setError("");
    try {
      await handleExport(url);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Button 
        variant="outlined" 
        color="primary" 
        data-testid={testId}
        onClick={onClick}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : undefined}
      >
        {label}
      </Button>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setError("")} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
