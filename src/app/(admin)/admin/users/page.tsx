'use client';

import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  
  const [users, setUsers] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");


  useEffect(() => {
    fetchApi('/users').then(res => setUsers(res.data)).catch(console.error);
  }, []);
  useEffect(() => {
    if (searchParams?.get("new") === "1") {
      setModalOpen(true);
    }
    if (searchParams?.get("search")) {
      setSearch(searchParams.get("search") || "");
    }
  }, [searchParams]);


  return (
    <div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          ????? ?????????
        </Typography>
        <button onClick={() => setModalOpen(true)} style={{ padding: 10, background: "#1976d2", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
          ????? ?????
        </button>
      </div>

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
