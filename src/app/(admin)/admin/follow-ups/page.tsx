"use client";
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Chip, Button, Grid, MenuItem, Select, FormControl, InputLabel, Pagination } from "@mui/material";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { displayName } from "@/lib/helpers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function AdminFollowUpsPage() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [engineers, setEngineers] = useState([]);
  const [regions, setRegions] = useState([]);
  
  const [filters, setFilters] = useState({ engineer: '', region: '', status: '', page: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetchApi('/users?role=engineer&limit=100').catch(() => ({ data: [] })),
      fetchApi('/regions').catch(() => ({ data: [] }))
    ]).then(([engRes, regRes]) => {
      setEngineers(engRes.data || []);
      setRegions(regRes.data || []);
    });
  }, []);

  useEffect(() => {
    let query = \`?page=\${filters.page}\`;
    if (filters.engineer) query += \`&engineer=\${filters.engineer}\`;
    if (filters.region) query += \`&region=\${filters.region}\`;
    if (filters.status) query += \`&status=\${filters.status}\`;

    setLoading(true);
    fetchApi(\`/admin/visits/follow-ups\${query}\`)
      .then(res => {
        setVisits(res.data);
        setTotalPages(res.pagination?.Math || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>متابعات المهندسين</Typography>

      <Card elevation={0} sx={{ border: "1px solid #e0e0e0", mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>المهندس</InputLabel>
                <Select value={filters.engineer} label="المهندس" onChange={e => setFilters({ ...filters, engineer: e.target.value, page: 1 })}>
                  <MenuItem value="">الكل</MenuItem>
                  {engineers.map(e => <MenuItem key={e._id} value={e._id}>{e.fullName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>المنطقة</InputLabel>
                <Select value={filters.region} label="المنطقة" onChange={e => setFilters({ ...filters, region: e.target.value, page: 1 })}>
                  <MenuItem value="">الكل</MenuItem>
                  {regions.map(r => <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>الحالة</InputLabel>
                <Select value={filters.status} label="الحالة" onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}>
                  <MenuItem value="">الكل</MenuItem>
                  <MenuItem value="today">اليوم</MenuItem>
                  <MenuItem value="overdue">متأخرة</MenuItem>
                  <MenuItem value="upcoming">قادمة</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Typography>جاري التحميل...</Typography>
      ) : visits.length === 0 ? (
        <Typography color="text.secondary">لا توجد متابعات مطابقة.</Typography>
      ) : (
        <>
          {visits.map(v => (
            <Card key={v._id} elevation={0} sx={{ border: "1px solid #e0e0e0", mb: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "primary.main", cursor: "pointer" }} onClick={() => router.push(\`/admin/visits/\${v._id}\`)}>
                      {displayName(v.company)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      المهندس: {v.engineer?.fullName} | تاريخ المتابعة: {new Date(v.followUp.dueDate).toLocaleDateString('ar-EG')}
                    </Typography>
                    <Chip size="small" label={v.followUp.status === 'overdue' ? 'متأخرة' : v.followUp.status === 'today' ? 'اليوم' : 'قادمة'} color={v.followUp.status === 'overdue' ? 'error' : v.followUp.status === 'today' ? 'warning' : 'primary'} sx={{ mb: 2 }} />
                    {v.followUp.note && (
                      <Typography variant="body2" sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>
                        {v.followUp.note}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination count={totalPages} page={filters.page} onChange={(e, p) => setFilters({ ...filters, page: p })} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
