import Link from "next/link";
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
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchApi, API_BASE_URL } from '@/lib/api';

export default function EngineerVisitsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchApi('/visits').then(res => setVisits(res.data)).catch(console.error);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = () => {
    window.open(`${API_BASE_URL}/reports/export-visits`, '_blank');
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          سجل الزيارات
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          تصدير Excel
        </Button>
      </Box>
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>التاريخ</TableCell>
                  <TableCell>الشركة</TableCell>
                  <TableCell>المنطقة</TableCell>
                  <TableCell>الحاضرون</TableCell>
                  <TableCell>الحالة</TableCell>
                  <TableCell>ملاحظات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{new Date(row.visitDate).toLocaleDateString('ar-EG')}</TableCell>
                    <TableCell>{row.company?.name}</TableCell>
                    <TableCell>{row.company?.region?.name || 'غير محدد'}</TableCell>
                    <TableCell>
                      {(!row.attendees || row.attendees.length === 0) ? '—' : 
                        `${row.attendees[0].name} ${row.attendees.length > 1 ? `(+${row.attendees.length - 1})` : ''}`
                      }
                    </TableCell>
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
                    <TableCell colSpan={6} align="center">لا يوجد زيارات</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={visits.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="الزيارات في الصفحة:"
          />
        </CardContent>
      </Card>
    </div>
  );
}
