"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Box, BottomNavigation, BottomNavigationAction, Paper, AppBar, Toolbar, Typography, Skeleton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MapIcon from "@mui/icons-material/Map";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useAuth } from "@/components/common/AuthProvider";
import Link from "next/link";

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Handled by AuthProvider
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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>أطلس كوبكو</Typography>
        </Toolbar>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/engineer">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="الرئيسية" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/engineer/visits/new">
              <ListItemIcon><AddBoxIcon /></ListItemIcon>
              <ListItemText primary="زيارة جديدة" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/engineer/visits">
              <ListItemIcon><MapIcon /></ListItemIcon>
              <ListItemText primary="الزيارات" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/engineer/companies">
              <ListItemIcon><BusinessIcon /></ListItemIcon>
              <ListItemText primary="الشركات" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/engineer/profile">
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="حسابي" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="تسجيل الخروج" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "100vh", pb: { xs: 7, md: 0 } }}>
        <AppBar position="sticky" color="inherit" elevation={1} sx={{ display: { md: "none" } }}>
          <Toolbar>
            <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>أطلس كوبكو</Typography>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: 2, bgcolor: "#f9f9f9" }}>
          {children}
        </Box>

        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000, display: { md: "none" } }} elevation={3}>
          <BottomNavigation showLabels value={getNavValue()}>
            <BottomNavigationAction component={Link} href="/engineer" label="الرئيسية" icon={<HomeIcon />} />
            <BottomNavigationAction component={Link} href="/engineer/visits/new" label="زيارة جديدة" icon={<AddBoxIcon />} />
            <BottomNavigationAction component={Link} href="/engineer/visits" label="الزيارات" icon={<MapIcon />} />
            <BottomNavigationAction component={Link} href="/engineer/companies" label="الشركات" icon={<BusinessIcon />} />
            <BottomNavigationAction component={Link} href="/engineer/profile" label="حسابي" icon={<PersonIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>
    </Box>
  );
}
