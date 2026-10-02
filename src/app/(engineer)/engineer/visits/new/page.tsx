'use client';

import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/components/common/AuthProvider';

export default function NewVisitPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('completed');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch companies in the engineer's region
    if (user?.region?._id) {
      fetchApi(`/companies?region=${user.region._id}`)
        .then(res => setCompanies(res.data))
        .catch(console.error);
    } else {
      fetchApi(`/companies`)
        .then(res => setCompanies(res.data))
        .catch(console.error);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await fetchApi('/visits', {
        method: 'POST',
        body: JSON.stringify({ company: companyId, notes, status }),
      });
      setMessage('تم تسجيل الزيارة بنجاح');
      setTimeout(() => router.push('/engineer/visits'), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        تسجيل زيارة جديدة
      </Typography>
      <Card sx={{ mt: 3, maxWidth: 600 }}>
        <CardContent>
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              select
              fullWidth
              label="الشركة"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              margin="normal"
              required
            >
              <MenuItem value="" disabled>اختر الشركة</MenuItem>
              {companies.map((c) => (
                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="الحالة"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              margin="normal"
              required
            >
              <MenuItem value="completed">مكتملة</MenuItem>
              <MenuItem value="planned">مخطط لها</MenuItem>
              <MenuItem value="cancelled">ملغاة</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="ملاحظات الزيارة"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              margin="normal"
              multiline
              rows={4}
            />
            <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }}>
              حفظ الزيارة
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
