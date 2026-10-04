
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, BottomNavigation, BottomNavigationAction, Paper, AppBar, Toolbar, Typography, Skeleton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MapIcon from "@mui/icons-material/Map";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "@/components/common/AuthProvider";
import Link from "next/link";

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "engineer") {
        router.replace("/admin/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "engineer") {
    return <Skeleton variant="rectangular" height="100vh" />;
  }

  const getNavValue = () => {
    if (pathname.includes("/visits/new")) return 1;
    if (pathname.includes("/visits")) return 2;
    if (pathname.includes("/companies")) return 3;
    if (pathname.includes("/profile")) return 4;
    return 0;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", pb: 7 }}>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar>
          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>أطلس كوبكو</Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 2, bgcolor: "#f9f9f9" }}>
        {children}
      </Box>

      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
        <BottomNavigation showLabels value={value} onChange={(e, v) => setValue(v)}>
          <BottomNavigationAction component={Link} href="/engineer" label="الرئيسية" icon={<HomeIcon />} />
          <BottomNavigationAction component={Link} href="/engineer/visits/new" label="زيارة جديدة" icon={<AddBoxIcon />} />
          <BottomNavigationAction component={Link} href="/engineer/visits" label="الزيارات" icon={<MapIcon />} />
          <BottomNavigationAction component={Link} href="/engineer/companies" label="الشركات" icon={<BusinessIcon />} />
          <BottomNavigationAction component={Link} href="/engineer/profile" label="حسابي" icon={<PersonIcon />} />

          } />
          } />
          } />
          } />
          } />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
