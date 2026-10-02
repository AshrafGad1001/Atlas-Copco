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
import Chip from '@mui/material/Chip';
import { fetchApi } from '@/lib/api';

export default function EngineerVisitsPage() {
  const [visits, setVisits] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/visits').then(res => setVisits(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        زياراتي
      </Typography>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>التاريخ</TableCell>
                  <TableCell>الشركة</TableCell>
                  <TableCell>المنطقة</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>ملاحظات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visits.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{new Date(row.visitDate).toLocaleDateString('ar-EG')}</TableCell>
                    <TableCell>{row.company?.name}</TableCell>
                    <TableCell>{row.company?.region?.name || 'غير محدد'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status === 'completed' ? 'مكتملة' : row.status === 'planned' ? 'مخطط لها' : 'ملغاة'} 
                        color={row.status === 'completed' ? 'success' : row.status === 'planned' ? 'warning' : 'error'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{row.notes || '-'}</TableCell>
                  </TableRow>
                ))}
                {visits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">لا توجد زيارات</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}
