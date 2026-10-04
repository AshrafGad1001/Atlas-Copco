"use client";
import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, Alert, Button, Avatar, Box } from "@mui/material";
import { formatDate } from "@/lib/helpers";

export default function EngineersTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true); setError(false);
    fetchApi("/admin/stats/engineers?sort=visitsMonth&limit=50")
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <Skeleton variant="rectangular" height={300} data-testid="engineers-table-loading" />;
  if (error) return <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadData}>إعادة المحاولة</Button>}>حدث خطأ</Alert>;
  if (!data || data.length === 0) return <Alert severity="info" data-testid="engineers-table-empty">لا يوجد مهندسون</Alert>;

  return (
    <TableContainer component={Paper} data-testid="engineers-table">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>المهندس</TableCell>
            <TableCell>المنطقة</TableCell>
            <TableCell>الموبايل</TableCell>
            <TableCell>الحالة</TableCell>
            <TableCell>زيارات الشهر</TableCell>
            <TableCell>آخر زيارة</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(e => (
            <TableRow key={e._id} hover style={{ cursor: "pointer" }} onClick={() => window.location.href = `/admin/users?search=${e.username}`}>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={e.profileImage?.url} alt={e.fullName} sx={{ width: 32, height: 32 }} />
                  {e.fullName}
                </Box>
              </TableCell>
              <TableCell>{e.region?.name}</TableCell>
              <TableCell>
                {e.primaryPhone ? <a href={`tel:${e.primaryPhone}`} onClick={ev => ev.stopPropagation()} dir="ltr">{e.primaryPhone}</a> : "-"}
              </TableCell>
              <TableCell>{e.isActive ? "نشط" : "معطل"}</TableCell>
              <TableCell>{e.visitsMonth}</TableCell>
              <TableCell>{e.lastVisitAt ? formatDate(e.lastVisitAt) : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}