'use client';

import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import VisitForm from '@/components/engineer/VisitForm';

export default function NewVisitPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (data: any) => {
    setMessage('');
    setError('');
    try {
      await fetchApi('/visits', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setMessage('تم تسجيل الزيارة بنجاح');
      setTimeout(() => router.push('/engineer/visits'), 1500);
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors.map((e: any) => e.message).join('، '));
      } else {
        setError(err.message || 'حدث خطأ غير متوقع');
      }
      throw err; // Re-throw to prevent loading spinner from freezing if we want it to reset
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        تسجيل زيارة جديدة
      </Typography>
      <Card sx={{ mt: 3, maxWidth: 800 }}>
        <CardContent>
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <VisitForm onSubmit={handleSubmit} submitText="حفظ الزيارة" />
        </CardContent>
      </Card>
    </div>
  );
}
