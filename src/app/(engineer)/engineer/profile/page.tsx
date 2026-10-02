'use client';

import React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useAuth } from '@/components/common/AuthProvider';

export default function EngineerProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        الملف الشخصي
      </Typography>
      <Card sx={{ mt: 3, maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            معلومات المهندس
          </Typography>
          {user ? (
            <div>
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
        </CardContent>
      </Card>
    </div>
  );
}
