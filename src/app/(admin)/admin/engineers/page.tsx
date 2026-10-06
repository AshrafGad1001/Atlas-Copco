"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { formatDateTime } from "@/lib/helpers";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, Select, Pagination, CircularProgress, Alert
} from "@mui/material";

export default function EngineersListPage() {
  const router = useRouter();
  const [engineers, setEngineers] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [sortBy, setSortBy] = useState("visitsDesc");

  useEffect(() => {
    fetchApi('/regions').then(res => setRegions(res.data)).catch(() => {});
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      let q = `/admin/stats/engineers?page=${page}&limit=20`;
      if (search) q += `&search=${search}`;
      if (regionFilter) q += `&region=${regionFilter}`;
      if (sortBy) q += `&sort=${sortBy}`;
      
      const res = await fetchApi(q);
      setEngineers(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.pages || 1);
      }
      setLoading(false);
    } catch (e: any) {
      setError(e.message || "حدث خطأ");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search, regionFilter, sortBy]);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>المهندسين</Typography>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField 
          size="small" 
          placeholder="بحث بالاسم أو المستخدم" 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
        />
        <Select 
          size="small" 
          displayEmpty 
          value={regionFilter} 
          onChange={(e) => { setRegionFilter(e.target.value); setPage(1); }}
        >
          <MenuItem value="">كل المناطق</MenuItem>
          {regions.map(r => <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>)}
        </Select>
        <Select 
          size="small" 
          value={sortBy} 
          onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
        >
          <MenuItem value="visitsDesc">الأكثر زيارات</MenuItem>
          <MenuItem value="visitsAsc">الأقل زيارات</MenuItem>
          <MenuItem value="nameAsc">الاسم (أ-ي)</MenuItem>
        </Select>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>المنطقة</TableCell>
              <TableCell>الموبايل الأساسي</TableCell>
              <TableCell align="center">زيارات الشهر</TableCell>
              <TableCell>آخر زيارة</TableCell>
              <TableCell align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
            ) : engineers.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">لا يوجد مهندسين</TableCell></TableRow>
            ) : (
              engineers.map((eng: any) => {
                const primaryPhone = eng.phones?.find((p: any) => p.isPrimary)?.number || eng.phones?.[0]?.number;
                return (
                  <TableRow key={eng._id}>
                    <TableCell fontWeight="bold">{eng.fullName}</TableCell>
                    <TableCell>{eng.region?.name || "-"}</TableCell>
                    <TableCell>
                      {primaryPhone ? <a href={`tel:${primaryPhone}`} dir="ltr" style={{ color: '#1976d2', textDecoration: 'none' }}>{primaryPhone}</a> : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="bold">{eng.monthVisits}</Typography>
                    </TableCell>
                    <TableCell>{eng.lastVisit ? formatDateTime(eng.lastVisit) : "-"}</TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" onClick={() => router.push(`/admin/engineers/${eng._id}`)}>
                        التفاصيل
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mb={4}>
          <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" />
        </Box>
      )}
    </Box>
  );
}
