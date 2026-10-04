'use client';

import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useAuth } from '@/components/common/AuthProvider';
import { fetchApi } from '@/lib/api';

export default function EngineerProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = React.useState<any>(null);
  React.useEffect(() => {
    fetchApi("/profile/me").then(res => setProfile(res.data)).catch(console.error);
  }, []);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetchApi('/profile/update-password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      setMessage(res.message);
      setTimeout(() => logout(), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div data-testid="engineer-profile-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        الملف الشخصي
      </Typography>
      <Card sx={{ mt: 3, maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            معلومات المهندس
          </Typography>
          {user ? (
            <div style={{ marginBottom: '2rem' }}>
              <Typography variant="body1"><strong>الاسم:</strong> {user.fullName}</Typography>
              <Typography variant="body1"><strong>اسم المستخدم:</strong> {user.username}</Typography>
              <Typography variant="body1"><strong>البريد الإلكتروني:</strong> {user.email}</Typography>
              <Typography variant="body1"><strong>المنطقة:</strong> {user.region?.name || 'غير محدد'}</Typography>
            </div>
          ) : (
            <Typography variant="body2" color="text.secondary">
              جاري التحميل...
            </Typography>
          )}

          <Typography variant="h6" gutterBottom>
            تغيير كلمة المرور
          </Typography>
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleChangePassword}>
            <TextField fullWidth label="كلمة المرور الحالية" type="password" margin="normal" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
            <TextField fullWidth label="كلمة المرور الجديدة" type="password" margin="normal" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>تغيير</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
