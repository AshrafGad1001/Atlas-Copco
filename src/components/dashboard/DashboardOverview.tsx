"use client";
import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Grid, Card, CardContent, Typography, Box, Skeleton, Alert, Button } from "@mui/material";

export default function DashboardOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true); setError(false);
    fetchApi("/admin/stats/overview")
      .then(res => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <Skeleton variant="rectangular" height={120} data-testid="dashboard-overview-loading" />;
  if (error) return <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadData}>إعادة المحاولة</Button>}>حدث خطأ أثناء تحميل الإحصائيات</Alert>;
  if (!data) return <Alert severity="info">لا توجد بيانات</Alert>;

  return (
    <Grid container spacing={2} data-testid="dashboard-overview">
      {[
        { title: "زيارات اليوم", value: data.visitsToday, color: "primary.main" },
        { title: "آخر 7 أيام", value: data.visits7d, color: "info.main" },
        { title: "هذا الشهر", value: data.visitsMonth, color: "success.main" },
        { title: "المهندسون النشطون", value: `${data.activeEngineers} من ${data.totalEngineers}`, color: "warning.main" },
        { title: "عدد الشركات", value: data.totalCompanies, color: "secondary.main" },
        { title: "شركات بدون زيارة 30 يوم", value: data.staleCompanies30, color: "error.main" }
      ].map((item, i) => (
        <Grid size={{xs: 6, sm: 4, md: 2}} key={i}>
          <Card sx={{ height: "100%" }} data-testid="dashboard-overview-card">
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 1, minHeight: 32 }}>{item.title}</Typography>
              <Typography variant="h5" sx={{ color: item.color, fontWeight: "bold" }}>{item.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}