import React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function AdminDashboardPage() {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        لوحة التحكم
      </Typography>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="body1">
            مرحباً بك في لوحة تحكم الإدارة. من هنا يمكنك إدارة المستخدمين، المناطق، ومتابعة تقارير الزيارات للمهندسين.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
