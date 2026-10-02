'use client';

import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { fetchApi } from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/users').then(res => setUsers(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        إدارة المستخدمين
      </Typography>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>الاسم</TableCell>
                  <TableCell>اسم المستخدم</TableCell>
                  <TableCell>المنطقة</TableCell>
                  <TableCell>الحالة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.region?.name || 'غير محدد'}</TableCell>
                    <TableCell>{row.isActive ? 'نشط' : 'معطل'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}
