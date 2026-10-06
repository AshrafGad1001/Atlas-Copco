"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Chip, Grid, MenuItem, Select, FormControl, InputLabel, Pagination } from "@mui/material";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { displayName } from "@/lib/helpers";

interface FollowUpVisit {
  _id: string;
  company: any;
  engineer?: { fullName?: string };
  followUp: { dueDate: string; note?: string; status?: string };
}

interface Option { _id: string; fullName?: string; name?: string }

const statusLabel = (s?: string) => (s === "overdue" ? "متأخرة" : s === "today" ? "اليوم" : "قادمة");
const statusColor = (s?: string): "error" | "warning" | "primary" => (s === "overdue" ? "error" : s === "today" ? "warning" : "primary");

export default function AdminFollowUpsPage() {
  const [visits, setVisits] = useState<FollowUpVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [engineers, setEngineers] = useState<Option[]>([]);
  const [regions, setRegions] = useState<Option[]>([]);
  const [filters, setFilters] = useState({ engineer: "", region: "", status: "", page: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetchApi("/users?role=engineer&limit=100").catch(() => ({ data: [] })),
      fetchApi("/regions").catch(() => ({ data: [] })),
    ]).then(([engRes, regRes]) => {
      setEngineers(engRes?.data || []);
      setRegions(regRes?.data || []);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(filters.page) });
    if (filters.engineer) params.set("engineer", filters.engineer);
    if (filters.region) params.set("region", filters.region);
    if (filters.status) params.set("status", filters.status);

    setLoading(true);
    fetchApi(`/admin/visits/follow-ups?${params.toString()}`)
      .then((res) => {
        setVisits(res?.data || []);
        setTotalPages(res?.pagination?.pages || 1);
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
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>المهندس</InputLabel>
                <Select value={filters.engineer} label="المهندس" onChange={(e) => setFilters({ ...filters, engineer: e.target.value, page: 1 })}>
                  <MenuItem value="">الكل</MenuItem>
                  {engineers.map((e) => <MenuItem key={e._id} value={e._id}>{e.fullName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>المنطقة</InputLabel>
                <Select value={filters.region} label="المنطقة" onChange={(e) => setFilters({ ...filters, region: e.target.value, page: 1 })}>
                  <MenuItem value="">الكل</MenuItem>
                  {regions.map((r) => <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>الحالة</InputLabel>
                <Select value={filters.status} label="الحالة" onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
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
          {visits.map((v) => (
            <Card key={v._id} elevation={0} data-testid="followup-card" sx={{ border: "1px solid #e0e0e0", mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "primary.main", cursor: "pointer" }} onClick={() => router.push(`/admin/visits/${v._id}`)}>
                  {displayName(v.company)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  المهندس: {v.engineer?.fullName} | تاريخ المتابعة: {new Date(v.followUp.dueDate).toLocaleDateString("ar-EG")}
                </Typography>
                <Chip size="small" label={statusLabel(v.followUp.status)} color={statusColor(v.followUp.status)} sx={{ mb: 2 }} />
                {v.followUp.note && (
                  <Typography variant="body2" sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1 }}>{v.followUp.note}</Typography>
                )}
              </CardContent>
            </Card>
          ))}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination count={totalPages} page={filters.page} onChange={(_e, p) => setFilters({ ...filters, page: p })} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
