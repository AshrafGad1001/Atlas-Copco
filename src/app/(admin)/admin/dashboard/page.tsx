"use client";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentVisits from "@/components/dashboard/RecentVisits";
import StaleCompanies from "@/components/dashboard/StaleCompanies";
import EngineersTable from "@/components/dashboard/EngineersTable";

export default function AdminDashboardPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        لوحة التحكم
      </Typography>
      
      <QuickActions />
      <Box sx={{ mt: 3, mb: 4 }}>
        <DashboardOverview />
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, mb: 4 }}>
        <Box sx={{ flex: 1, overflowX: "auto" }}>
          <Typography variant="h6" gutterBottom>آخر الزيارات</Typography>
          <RecentVisits />
        </Box>
        <Box sx={{ flex: 1, overflowX: "auto" }}>
          <Typography variant="h6" gutterBottom>شركات تحتاج لزيارة</Typography>
          <StaleCompanies />
        </Box>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <Typography variant="h6" gutterBottom>أداء المهندسين</Typography>
        <EngineersTable />
      </Box>
    </Box>
  );
}