"use client";
import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, Alert, Button } from "@mui/material";
import { displayName } from "@/lib/helpers";

export default function RecentVisits() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true); setError(false);
    fetchApi("/admin/stats/recent?limit=10")
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <Skeleton variant="rectangular" height={200} data-testid="recent-visits-loading" />;
  if (error) return <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadData}>إعادة المحاولة</Button>}>حدث خطأ</Alert>;
  if (!data || data.length === 0) return <Alert severity="info" data-testid="recent-visits-empty">لا توجد زيارات</Alert>;

  return (
    <TableContainer component={Paper} data-testid="recent-visits">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>التاريخ والوقت</TableCell>
            <TableCell>المهندس</TableCell>
            <TableCell>الشركة</TableCell>
            <TableCell>النوع</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(v => (
            <TableRow key={v._id} hover style={{ cursor: "pointer" }} onClick={() => window.location.href = `/admin/visits/${v._id}`}>
              <TableCell>{new Date(v.visitDate).toLocaleString("ar-EG")}</TableCell>
              <TableCell>{v.engineer?.fullName}</TableCell>
              <TableCell>{displayName(v.company)}</TableCell>
              <TableCell>{v.type === "completed" ? "مكتملة" : v.type === "planned" ? "مخطط لها" : "ملغاة"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}