"use client";
import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, Alert, Button } from "@mui/material";
import { displayName } from "@/lib/helpers";

export default function StaleCompanies() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true); setError(false);
    fetchApi("/admin/stats/stale-companies?days=30&limit=10")
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <Skeleton variant="rectangular" height={200} data-testid="stale-companies-loading" />;
  if (error) return <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadData}>إعادة المحاولة</Button>}>حدث خطأ</Alert>;
  if (!data || data.length === 0) return <Alert severity="info" data-testid="stale-companies-empty">لا توجد شركات</Alert>;

  return (
    <TableContainer component={Paper} data-testid="stale-companies">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>اسم الشركة</TableCell>
            <TableCell>المنطقة</TableCell>
            <TableCell>آخر زيارة</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(c => (
            <TableRow key={c._id} hover style={{ cursor: "pointer" }} onClick={() => window.location.href = `/admin/companies?search=${c.nameEn}`}>
              <TableCell>{displayName(c)}</TableCell>
              <TableCell>{c.region?.name}</TableCell>
              <TableCell>{c.lastVisitAt ? new Date(c.lastVisitAt).toLocaleDateString("ar-EG") : "لم تُزَر أبداً"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}