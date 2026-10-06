"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { formatDateTime } from "@/lib/helpers";
import {
  Box, Card, CardContent, Typography, Grid, CircularProgress, Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Select, MenuItem, TextField
} from "@mui/material";

import ExportButton from "@/components/common/ExportButton";
export default function EngineerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [engineer, setEngineer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  // Filters
  const [visitType, setVisitType] = useState("");
  const [visitFrom, setVisitFrom] = useState("");
  const [visitTo, setVisitTo] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get engineer details (using users endpoint for now)
      const usersRes = await fetchApi('/users');
      const found = usersRes.data.find((u: any) => u._id === id);
      if (!found) throw new Error("لم يتم العثور على المهندس");
      setEngineer(found);

      // Get Stats
      const statsRes = await fetchApi(`/admin/engineers/${id}/stats`);
      setStats(statsRes.data);

      // Get Region Companies
      if (found.region?._id) {
        const compsRes = await fetchApi(`/companies?region=${found.region._id}&limit=1000`);
        setCompanies(compsRes.data || []);
      }

      await loadVisits();
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "خطأ في تحميل البيانات");
      setLoading(false);
    }
  };

  const loadVisits = async () => {
    try {
      let q = `/admin/visits?engineer=${id}`;
      if (visitType) q += `&type=${visitType}`;
      if (visitFrom) q += `&from=${visitFrom}`;
      if (visitTo) q += `&to=${visitTo}`;
      const visitsRes = await fetchApi(q);
      setVisits(visitsRes.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (engineer) loadVisits();
  }, [visitType, visitFrom, visitTo]);

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Box p={4}><Alert severity="error">{error}</Alert><Button onClick={loadData} sx={{ mt: 2 }}>إعادة المحاولة</Button></Box>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">ملف المهندس</Typography>
        {/* Export Button Placeholder */}
        <ExportButton url={`/reports/export-visits?engineer=${id}&type=${visitType}&from=${visitFrom}&to=${visitTo}`} />
      </Box>

      {/* Profile */}
      <Card sx={{ mb: 4 }} variant="outlined">
        <CardContent>
          <Typography variant="h5">{engineer.fullName}</Typography>
          <Typography color="text.secondary">المنطقة: {engineer.region?.name || "غير محدد"}</Typography>
          <Typography color="text.secondary">البريد: {engineer.email}</Typography>
          {engineer.phones?.map((p: any, i: number) => (
            <Typography key={i} color="text.secondary">
              الهاتف: <a href={`tel:${p.number}`} dir="ltr">{p.number}</a>
            </Typography>
          ))}
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: "زيارات اليوم", value: stats.visitsToday },
            { label: "زيارات آخر 7 أيام", value: stats.visits7d },
            { label: "زيارات الشهر", value: stats.visitsMonth },
            { label: "شركات المنطقة", value: stats.companiesInRegion },
            { label: "تغطية آخر 30 يوم", value: `${stats.coveragePercent}% (${stats.visitedByHimLast30} شركة)` },
            { label: "آخر زيارة", value: stats.lastVisitAt ? formatDateTime(stats.lastVisitAt) : "لا يوجد" }
          ].map((s, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card variant="outlined" sx={{ height: "100%", bgcolor: "grey.50" }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>{s.label}</Typography>
                  <Typography variant="h5">{s.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Visits */}
      <Typography variant="h5" mb={2} fontWeight="bold">زيارات المهندس</Typography>
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <Select size="small" value={visitType} onChange={(e) => setVisitType(e.target.value)} displayEmpty>
          <MenuItem value="">كل الأنواع</MenuItem>
          <MenuItem value="planned">مخطط لها</MenuItem>
          <MenuItem value="completed">مكتملة</MenuItem>
          <MenuItem value="cancelled">ملغاة</MenuItem>
        </Select>
        <TextField size="small" type="date" label="من" InputLabelProps={{ shrink: true }} value={visitFrom} onChange={(e) => setVisitFrom(e.target.value)} />
        <TextField size="small" type="date" label="إلى" InputLabelProps={{ shrink: true }} value={visitTo} onChange={(e) => setVisitTo(e.target.value)} />
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>التاريخ</TableCell>
              <TableCell>الشركة</TableCell>
              <TableCell>النوع</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center">لا توجد زيارات</TableCell></TableRow>
            ) : (
              visits.map(v => (
                <TableRow key={v._id}>
                  <TableCell>{formatDateTime(v.visitDate)}</TableCell>
                  <TableCell>{v.company?.nameAr || v.company?.nameEn}</TableCell>
                  <TableCell>
                    <Chip size="small" label={v.type === "planned" ? "مخطط لها" : v.type === "completed" ? "مكتملة" : "ملغاة"} />
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => router.push(`/admin/visits/${v._id}`)}>التفاصيل</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Companies */}
      <Typography variant="h5" mb={2} fontWeight="bold">شركات منطقته</Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>المجال</TableCell>
              <TableCell>العنوان</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center">لا توجد شركات</TableCell></TableRow>
            ) : (
              companies.map(c => (
                <TableRow key={c._id}>
                  <TableCell>{c.nameAr || c.nameEn}</TableCell>
                  <TableCell>{c.industry || "-"}</TableCell>
                  <TableCell>{c.address || "-"}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => router.push(`/admin/companies/${c._id}`)}>التفاصيل</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
